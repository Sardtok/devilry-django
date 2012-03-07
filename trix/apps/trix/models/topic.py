from django.utils.translation import ugettext as _
from django.db import models
from devilry.apps.core.models.custom_db_fields import LongNameField

class Topic(models.Model):
    """
    An exercise topic for exercises in Trix.

    It might make sense to make this extend BaseNode,
    but we'd have to find a sensible parentnode:
    Node, as in institute, faculty or school, could make sense.

    We'll also have to make a sensible structure.
    Should topics relate to one another,
    or should exercises just be tagged with topics.
    """

    class Meta:
        app_label = 'trix'
        verbose_name = _('Topic')
        verbose_name_plural = _('Topics')
        ordering = ['name']
    
    name = LongNameField()
    
