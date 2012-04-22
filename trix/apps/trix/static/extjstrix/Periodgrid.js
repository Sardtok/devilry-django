Ext.define('trix.Periodgrid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.trixperiodstats',
    title: gettext('Periods'),
    store: periodstore,
    columns: [
        {header: gettext('Period'),  dataIndex: 'long_name', flex: 1},
        {header: gettext('Points'), dataIndex: 'points', flex: 1,
	 renderer: function(value, md, record) {
	     return String(value + gettext(' of ') + record.get('total_points'));}},
        {header: 
	 gettext('Exercises done'), dataIndex: 'exercises_done', flex:1,
	 renderer: function(value, md, record) {
	     return String(value) + gettext(' of ') + record.get('exercises');}},
        {header: 
	 gettext('Key exercises'), dataIndex: 'starred_done', flex:1,
	 renderer: function(value, md, record) {
	     return String(value) + gettext(' of ') + record.get('starred');   
	 }}
    ]
});