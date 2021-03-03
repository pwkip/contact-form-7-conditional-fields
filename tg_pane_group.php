<div class="control-box">
    <fieldset>
        <legend><?php echo sprintf( esc_html( $description ) ); ?></legend>

        <table class="form-table">
            <tbody>

            <tr>
                <th scope="row"><label for="<?php echo esc_attr( $args['content'] . '-name' ); ?>"><?php _e( 'Name', 'cf7-conditional-fields' ); ?></label></th>
                <td><input type="text" name="name" class="tg-name oneline" id="<?php echo esc_attr( $args['content'] . '-name' ); ?>" /></td>
            </tr>

            <tr>
                <th scope="row"><label for="clear_on_hide"><?php _e( 'Clear on hide', 'cf7-conditional-fields' ); ?></label></th>
                <td><input type="checkbox" name="clear_on_hide" class="option" id="clear_on_hide" /></td>
            </tr>

            <?php if (WPCF7CF_IS_PRO) { ?>
            <tr>
                <th scope="row"><label for="disable_on_hide"><?php echo esc_html( __( 'Disable on hide', 'cf7-conditional-fields' ) ); ?></label></th>
                <td><input type="checkbox" name="disable_on_hide" class="option" id="disable_on_hide" /></td>
            </tr>
            <?php } ?>

            <tr>
                <th scope="row"><label for="inline"><?php echo esc_html( __( 'Inline', 'cf7-conditional-fields' ) ); ?></label></th>
                <td><input type="checkbox" name="inline" class="option" id="inline" /></td>
            </tr>

            </tbody>
        </table>
    </fieldset>
</div>

<div class="insert-box">
    <input type="text" name="<?php echo $type; ?>" class="tag code" readonly="readonly" onfocus="this.select()" />

    <div class="submitbox">
        <input type="button" class="button button-primary insert-tag" value="<?php _e( 'Insert Tag', 'cf7-conditional-fields' ); ?>" />
    </div>

    <br class="clear" />
</div>