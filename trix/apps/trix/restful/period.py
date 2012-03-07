from devilry.restful import restful_modelapi, ModelRestfulView, RestfulManager
from devilry.apps.extjshelpers import extjs_restful_modelapi

from trix.apps.trix.simplified import SimplifiedPeriod
from manager import trix_manager
from authorization import AuthorizationMixin
from subject import RestfulSimplifiedSubject

@trix_manager.register
@extjs_restful_modelapi
@restful_modelapi
class RestfulSimplifiedPeriod(AuthorizationMixin):
    class Meta:
        simplified = SimplifiedPeriod
        foreignkey_fields = {'parentnode': RestfulSimplifiedSubject}

    class ExtjsModelMeta:
        combobox_displayfield = 'short_name'
        combobox_tpl = ('<div class="section popuplistitem">'
                        '    <p class="path">{parentnode__short_name}</div>'
                        '    <h1>{long_name:ellipsis(40)}</h1>'
                        '</div>')
