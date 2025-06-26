<?php
/**
** A base module for [group]
**/

/* form_tag handler */

add_action( 'wpcf7_init', 'wpcf7_add_form_tag_group', 10, 0 );

function wpcf7_add_form_tag_group() {
	wpcf7_add_form_tag( 'group',
		'wpcf7_group_form_tag_handler',
		array(
			'name-attr' => true,
			'selectable-values' => true,
		)
	);
}

function wpcf7_group_form_tag_handler( $tag ) {
	// Frontend output code comes here
}


/* Validation filter */

add_filter( 'wpcf7_validate_group',
	'wpcf7_group_validation_filter', 10, 2 );

function wpcf7_group_validation_filter( $result, $tag ) {
  // Frontend validation code comes here
}


/* Tag generator */

add_action( 'wpcf7_admin_init', 'wpcf7_add_tag_generator_group', 590, 0 );

function wpcf7_add_tag_generator_group() {
	$tag_generator = WPCF7_TagGenerator::get_instance();

	$tag_generator->add( 'group', __( 'Conditional group', 'cf7-conditional-fields' ),
		'wpcf7_tag_generator_group',
	 	array( 'version' => '2' )
	);

    do_action('wpcf7cf_tag_generator');
}

function wpcf7_tag_generator_group( $contact_form, $options ) {
	$field_types = array(
		'group' => array(
			'display_name' => __( 'Conditional group', 'cf7-conditional-fields' ),
			'heading' => __( 'Conditional group form-tag generator', 'cf7-conditional-fields' ),
			'description' => __( 'Generates the opening and closing form-tag for a Conditional group.', 'cf7-conditional-fields' ),
		),
	);

	$tgg = new WPCF7_TagGeneratorGenerator( $options['content'] );

?>
<header class="description-box">
	<h3><?php
		echo esc_html( $field_types['group']['heading'] );
	?></h3>

	<p><?php
		$description = wp_kses(
			$field_types['group']['description'],
			array(
				'a' => array( 'href' => true ),
				'strong' => array(),
			),
			array( 'http', 'https' )
		);

		echo $description;
	?></p>
</header>

<div class="control-box">
	<fieldset style="display:none;">
		<legend id="<?php echo esc_attr( $tgg->ref( 'type-legend' ) ); ?>"><?php
			echo esc_html( __( 'Field type', 'contact-form-7' ) );
		?></legend>

		<select data-tag-part="basetype" aria-labelledby="<?php echo esc_attr( $tgg->ref( 'type-legend' ) ); ?>"><?php
			echo sprintf(
				'<option %1$s>%2$s</option>',
				wpcf7_format_atts( array(
					'value' => 'group',
				) ),
				esc_html( $field_types['group']['display_name'] )
			);
		?></select>

	</fieldset>

    <fieldset>
        <legend id="tag-generator-panel-group-name-legend">Group name</legend>
        <input type="text" data-tag-part="name" pattern="[A-Za-z][A-Za-z0-9_\-]*" aria-labelledby="tag-generator-panel-group-name-legend">
    </fieldset>

    
    <fieldset>
		<legend id="<?php echo esc_attr( $tgg->ref( 'type-legend' ) ); ?>"><?php
			echo esc_html( __( 'Options', 'cf7-conditional-fields' ) );
		?></legend>
		<label>
			<input type="checkbox" data-tag-part="option" data-tag-option="clear_on_hide" />
			<strong>clear_on_hide</strong> (<?php echo esc_html( __( "clear inner fields when this group is hidden", 'cf7-conditional-fields' ) ); ?>)
		</label>
        <br>
		<label>
			<input type="checkbox" data-tag-part="option" data-tag-option="inline" />
			<strong>inline</strong> (<?php echo esc_html( __( "use <span> instead of <div>", 'cf7-conditional-fields' ) ); ?>)
		</label>
        <?php if (WPCF7CF_IS_PRO) { ?>
            <br>
            <label>
                <input type="checkbox" data-tag-part="option" data-tag-option="disable_on_hide" />
                <strong>disable_on_hide</strong> (<?php echo esc_html( __( "disable inner fields when this group is hidden", 'cf7-conditional-fields' ) ); ?>)
            </label>
        <?php } ?>
	</fieldset>

    <?php

		$tgg->print( 'class_attr' );
	?>

    <?php
        echo sprintf(
            '<input %s />',
            wpcf7_format_atts( array(
                'type' => 'hidden',
                'required' => false,
                'value' => '…',
                'data-tag-part' => 'content',
            ) )
        );
    ?>
</div>

<footer class="insert-box">
	<?php
		$tgg->print( 'insert_box_content' );
	?>
	<p class="mail-tag-tip">To show conditional information in the email, put it between <strong data-tag-part="mail-tag">[group-455]</strong> and <strong data-tag-part="mail-tag-closed">[/group-455]</strong> in the email template.</p>
</footer>
<?php
}
