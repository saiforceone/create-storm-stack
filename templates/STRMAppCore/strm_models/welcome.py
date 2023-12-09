# ST🌀RM Stack CLI
# core imports
import datetime
import mongoengine as me


class Welcome(me.Document):
	label = me.StringField(required=True, max_length=200)
	updated_at = me.DateTimeField(default=datetime.datetime.utcnow)
