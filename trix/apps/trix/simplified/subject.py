from devilry.coreutils.simplified.metabases import SimplifiedSubjectMetaMixin
from devilry.simplified import FieldSpec, simplified_modelapi, SimplifiedModelApi
from devilry.apps.core.models import Subject
from authorization import AuthorizationMixin

@simplified_modelapi
class SimplifiedSubject(AuthorizationMixin):
    class Meta(SimplifiedSubjectMetaMixin):
        model = Subject
        methods = ['create', 'read', 'update', 'delete', 'search']
    
