class AssignmentGroupExtjsModelMeta:
    """ Metadata for AssignmentGroup javascript. """
    combobox_fieldgroups = ['assignment', 'period', 'subject', 'users']
    combobox_tpl = ('<section class="popuplistitem">'
                    '    <table>'
                    '        <tr>'
                    '            <td>'
                    '               <ul class="useridlist"><tpl for="candidates__identifier"><li>{.}</li></tpl></ul>'
                    '               <p><tpl if="name">{name}</tpl><p>'
                    '               <p>'
                    '                   <tpl if="is_open"><span class="group_is_open">Correction not completed</span></tpl>'
                    '                   <tpl if="!is_open"><span class="group_is_closed">Correction completed</span></tpl>'
                    '               </p>'
                    '            </td>'
                    '            <td class="rightaligned">'
                    '               <h1>{parentnode__parentnode__parentnode__long_name:ellipsis(60)}</h1>'
                    '               <h2>{parentnode__parentnode__long_name:ellipsis(60)}</h2>'
                    '               <h3>{parentnode__long_name:ellipsis(60)}</h3>'
                    '            </td>'
                    '        </tr>'
                    '    </table>'
                   '</section>')
    combobox_displayfield = 'id'
