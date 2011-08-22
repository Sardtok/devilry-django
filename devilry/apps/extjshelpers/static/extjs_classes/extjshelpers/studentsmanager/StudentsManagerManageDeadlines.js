/** The deadline management methods for StudentsManager.
 *
 * Note that this class depends on createRecordFromStoreRecord(),
 * onSelectNone() and loadFirstPage() from StudentsManager to be available. */
Ext.define('devilry.extjshelpers.studentsmanager.StudentsManagerManageDeadlines', {
    requires: [
        'devilry.extjshelpers.assignmentgroup.MultiCreateNewDeadlineWindow'
    ],

    /**
     * @private
     */
    onAddDeadline: function() {
        //this.down('studentsmanager_studentsgrid').selModel.selectAll();
        if(this.noneSelected()) {
            this.onSelectNone();
            return;
        }
        var me = this;
        var createDeadlineWindow = Ext.widget('multicreatenewdeadlinewindow', {
            deadlinemodel: this.deadlinemodel,
            onSaveSuccess: function(record) {
                this.close();
                me.addDeadlineToSelected(record);
            }
        });
        createDeadlineWindow.show();
    },

    /**
     * @private
     */
    addDeadlineToSelected: function(record) {
        this.down('studentsmanager_studentsgrid').performActionOnSelected({
            scope: this,
            callback: this.addDeadline,
            extraArgs: [record]
        });
    },

    /**
     * @private
     */
    addDeadline: function(assignmentGroupRecord, index, total, deadlineRecord) {
        var msg = Ext.String.format('Adding deadline to group {0}/{1}', index, total);
        this.getEl().mask(msg);

        this.statics().createDeadline(assignmentGroupRecord, deadlineRecord, this.deadlinemodel, {
            scope: this,
            failure: function() {
                console.error('Failed to save deadline record');
            }
        });

        if(index == total) {
            this.loadFirstPage();
            this.getEl().unmask();
        }
    },

    statics: {
        createDeadline: function(assignmentGroupRecord, deadlineRecord, deadlinemodel, saveopt) {
            var newDeadlineRecord = Ext.ModelManager.create(deadlineRecord.data, deadlinemodel);
            newDeadlineRecord.data.assignment_group = assignmentGroupRecord.data.id;
            newDeadlineRecord.save(saveopt);
        }
    }
});
