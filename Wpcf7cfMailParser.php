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
		return preg_replace_callback(WPCF7CF_REGEX_MAIL_GROUP_INVERTIBLE, array($this, 'hide_hidden_mail_fields_regex_callback'), $this->mail_body );
	}

	function hide_hidden_mail_fields_regex_callback ( $matches ) {
		$inverted = $matches[1] === '!'; // [!tagname]...[/!tagname] shows its content when the group is hidden
		$name = $matches[2];

		$content = $matches[3];

		if ( in_array( $name, $this->hidden_groups ) ) {

		    // The tag name represents a hidden group, so keep only the inverted content
            return $inverted
                ? preg_replace_callback(WPCF7CF_REGEX_MAIL_GROUP_INVERTIBLE, array($this, 'hide_hidden_mail_fields_regex_callback'), $content )
                : '';

		} elseif ( in_array( $name, $this->visible_groups ) ) {

		    // The tag name represents a visible group, so remove the tags themselves, but return everything else
			// ( instead of just returning the $content, return the preg_replaced content )
			return $inverted
                ? ''
                : preg_replace_callback(WPCF7CF_REGEX_MAIL_GROUP_INVERTIBLE, array($this, 'hide_hidden_mail_fields_regex_callback'), $content );

		} elseif ( !$inverted && $this->repeaters !== null && in_array( $name, $this->repeaters ) ) {

			$original_name = explode('__',$name)[0];

            $inner_template = $content;

            ob_start();

            $max_repeaters = apply_filters('wpcf7cf_max_repeater_count', 200);
            $num_subs = isset($this->posted_data[$name.'_count'])
                ? min($max_repeaters, max(0, intval($this->posted_data[$name.'_count'])))
                : 0;

            for ($i=1; $i<=$num_subs; $i++) {
				$str = preg_replace(["/\[{$original_name}\:index[^\]]*?\]/"],$i,$inner_template);
                //echo str_replace(']','__'.$i.']',$str);
				echo preg_replace("/\[([^\s^\]]*?)([\s\]]+)([^\]]*?)/", "[$1__{$i}$2",$str);
            }

            $underscored_content = ob_get_clean();

            return preg_replace_callback(WPCF7CF_REGEX_MAIL_GROUP_INVERTIBLE, array($this, 'hide_hidden_mail_fields_regex_callback'), $underscored_content );

		}else {

		    // The tag name doesn't represent a group that was used in the form. Leave it alone (return the entire match).
			return $matches[0];

		}
	}
}