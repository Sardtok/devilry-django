from devilry.restful import restful_modelapi, ModelRestfulView, RestfulManager
from devilry.apps.extjshelpers import extjs_restful_modelapi

from trix.apps.trix.simplified import SimplifiedPeriodGroup
from manager import trix_manager
from authorization import AuthorizationMixin
from subject import RestfulSimplifiedSubject

@trix_manager.register
@extjs_restful_modelapi
@restful_modelapi
class RestfulSimplifiedPeriodGroup(AuthorizationMixin):
    class Meta:
        simplified = SimplifiedPeriodGroup
        foreignkey_fields = {'subject': RestfulSimplifiedSubject}

    class ExtjsModelMeta:
        combobox_displayfield = 'long_name'
        combobox_tpl = ('<div class="section popuplistitem">'
                        '    <p class="path">{subject__long_name}</p>'
                        '    <h1>{long_name:ellipsis(40)}</h1>'
                        '</div>')
