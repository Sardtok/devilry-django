from django.utils.translation import ugettext as _
from django.contrib.auth.models import User
from django.db import models

from devilry.apps.core.models import Subject
from devilry.apps.core.models.custom_db_fields import ShortNameField, LongNameField

class PeriodGroup(models.Model):
    """
    A group of periods in a semester (or similar).
    """
    
    class Meta:
        app_label = 'trix'
        unique_together = ('long_name', 'subject')
    
    long_name = LongNameField()
    subject = models.ForeignKey(Subject, related_name="periodgroup",
                                verbose_name=_('Subject'))
    followers = models.ManyToManyField(User, related_name="followedgroups",
                                      verbose_name=_('Followers'))
    students = models.ManyToManyField(User, related_name="periodgroups",
                                      verbose_name=_('Students'))
