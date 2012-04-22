Ext.define('trix.Topicgrid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.trixtopicstats',
    title: gettext('Topics'),
    store: topicstore,
    columns: [
        {header: gettext('Topic'),  dataIndex: 'name', flex:1},
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