from devilry.coreutils.simplified.metabases import SimplifiedSubjectMetaMixin
from devilry.simplified import FieldSpec, simplified_modelapi, SimplifiedModelApi
from authorization import AuthorizationMixin

@simplified_modelapi
class SimplifiedSubject(AuthorizationMixin):
    class Meta(SimplifiedSubjectMetaMixin):
        methods = ['create', 'read', 'update', 'delete', 'search']
    
