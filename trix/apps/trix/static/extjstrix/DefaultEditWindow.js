/** Default config for the Create New window, which is opened to create an item
 * in the admin interface. */
Ext.define('trix.DefaultEditWindow', {
    extend: 'devilry.extjshelpers.RestfulSimplifiedEditWindowBase',
    title: gettext('Create new'),

    config: {
        /**
         * @cfg
         * ``Ext.XTemplate`` for the url to visit on successful save. The
         * template gets the record data as input.
         */
        successUrlTpl: undefined
    },

    onSaveSuccess: function(record) {
        this.close();
    }
});
