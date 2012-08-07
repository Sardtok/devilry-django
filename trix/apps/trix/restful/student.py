from devilry.restful import restful_modelapi, ModelRestfulView, RestfulManager
from devilry.apps.extjshelpers import extjs_restful_modelapi

from trix.apps.trix.simplified import SimplifiedStudent
from manager import trix_manager
from authorization import AuthorizationMixin
from periodgroup import RestfulSimplifiedPeriodGroup

@trix_manager.register
@extjs_restful_modelapi
@restful_modelapi
class RestfulSimplifiedStudent(AuthorizationMixin):
    class Meta:
        simplified = SimplifiedStudent
        foreignkey_fields = {'followedgroups': RestfulSimplifiedPeriodGroup,
                             'periodgroups': RestfulSimplifiedPeriodGroup}

    class ExtjsModelMeta:
        combobox_displayfield = 'username'
        combobox_tpl = ('<div class="section popuplistitem">'
                        '    <h1>{username:ellipsis(40)}</h1>'
                        '</div>')
