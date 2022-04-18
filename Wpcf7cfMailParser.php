<?php

//require_once __DIR__.'/init.php';

class Wpcf7cfMailParser {
	private $mail_body;
	private $visible_groups;
	private $hidden_groups;
	private $repeaters;
	private $posted_data;

	function __construct($mail_body, $visible_groups, $hidden_groups, $repeaters, $posted_data) {
		$this->mail_body = $mail_body;
		$this->visible_groups = $visible_groups;
		$this->hidden_groups = $hidden_groups;
		$this->repeaters = $repeaters;
		$this->posted_data = $posted_data;
	}

	public function getParsedMail() {
		return preg_replace_callback(WPCF7CF_REGEX_MAIL_GROUP, array($this, 'hide_hidden_mail_fields_regex_callback'), $this->mail_body );
	}

	function hide_hidden_mail_fields_regex_callback ( $matches ) {
		$name = $matches[1];

		$name_parts = explode('__', $name);

		$name_root = array_shift($name_parts);
        $name_suffix = implode('__',$name_parts);

		$content = $matches[2];

		if ( in_array( $name, $this->hidden_groups ) ) {

		    // The tag name represents a hidden group, so replace everything from [tagname] to [/tagname] with nothing
            return '';

		} elseif ( in_array( $name, $this->visible_groups ) ) {

		    // The tag name represents a visible group, so remove the tags themselves, but return everything else
			// ( instead of just returning the $content, return the preg_replaced content )
			return preg_replace_callback(WPCF7CF_REGEX_MAIL_GROUP, array($this, 'hide_hidden_mail_fields_regex_callback'), $content );

		} elseif ( $this->repeaters !== null && in_array( $name, $this->repeaters ) ) {

			$original_name = explode('__',$name)[0];

            $inner_template = $content;

            ob_start();

            $num_subs = $this->posted_data[$name.'_count'];

            for ($i=1; $i<=$num_subs; $i++) {
				$str = preg_replace(["/\[{$original_name}\:index[^\]]*?\]/"],$i,$inner_template);
                //echo str_replace(']','__'.$i.']',$str);
				echo preg_replace("/\[([^\s^\]]*?)([\s\]]+)([^\]]*?)/", "[$1__{$i}$2",$str);
            }

            $underscored_content = ob_get_clean();

            return preg_replace_callback(WPCF7CF_REGEX_MAIL_GROUP, array($this, 'hide_hidden_mail_fields_regex_callback'), $underscored_content );

		}else {

		    // The tag name doesn't represent a group that was used in the form. Leave it alone (return the entire match).
			return $matches[0];

		}
	}
}