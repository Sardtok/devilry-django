{
    padding: 20,
    border: false,
    frame: false,
    xtype: 'form',
    //items: [{
        //xtype: 'checkboxfield',
        //boxLabel: 'Approved',
        //id: 'approved-checkbox'
    //}],

    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    fieldDefaults: {
        labelAlign: 'top',
        labelWidth: 100,
        labelStyle: 'font-weight:bold'
    },
    defaults: {
        margins: '0 0 10 0'
    },
    /**
     * Called by the grade-editor main window just before calling
     * setDraftstring() for the first time.
     *
     * @param config Get the grade editor configuration that is stored on the
     *      current assignment.
     */
    initializeEditor: function(config) {
        this.editorConfig = Ext.JSON.decode(config.config);

        this.points = Ext.widget('numberfield', {
            fieldLabel: 'Enter points',
            minValue: 0,
            maxValue: this.editorConfig.maxpoints,
            flex: 0
        });
        this.textarea = Ext.widget('textareafield', {
            fieldLabel: 'Enter feedback',
            flex: 1
        });
        this.add(this.points);
        this.add(this.textarea);
    },

    /**
     * Called by the grade-editor main window to set the current draft. Used
     * both on initialization and when selecting a draft from history (rolling
     * back to a previous draft).
     *
     * @param draftstring The current draftstring, or ``undefined`` if no
     *      drafts have been saved yet.
     */
    setDraftstring: function(draftstring) {
        if(draftstring != undefined) {
        //} else{
            var buf = Ext.JSON.decode(draftstring);
            this.points.setValue(buf.points);
            this.textarea.setValue(buf.feedback);
        }
        this.getEl().unmask(); // Unmask the loading mask (set by the main window).
    },

    /**
     * Called when the 'save draft' button is clicked.
     */
    onSaveDraft: function() {
        if (this.getForm().isValid()) {
            var draft = this.createDraft();
            this.getMainWin().saveDraft(draft, this.onFailure);
        }
    },

    /**
     * Called when the publish button is clicked.
     */
    onPublish: function() {
        if (this.getForm().isValid()) {
            var draft = this.createDraft();
            this.getMainWin().saveDraftAndPublish(draft, this.onFailure);
        }
    },

    /**
     * @private
     * Get the grade draft editor main window.
     */
    getMainWin: function() {
        return this.up('gradedrafteditormainwin');
    },

    /**
     * @private
     * Used by onSaveDraft and onPublish to handle save-failures.
     */
    onFailure: function() {
        console.error('Failed!');
    },

    /**
     * @private
     * Create a draft (used in onSaveDraft and onPublish)
     */
    createDraft: function() {
        var points = this.points.getValue();
        var feedback = this.textarea.getValue();
        
        var retval = {points: points, feedback: feedback}

        var draft = Ext.JSON.encode(retval);
        return draft;
    }
}
