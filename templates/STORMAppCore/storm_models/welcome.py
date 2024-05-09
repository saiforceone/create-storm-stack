# author: create-storm-stack / ST🌀RM Stack CLI

# core imports
import mongoengine as me
from _base import StormModel


class Welcome(StormModel):
	"""
	📝 Developer Note: This model is to provide you with an idea of models should be constructed.
	You may choose to delete this model since based on this.
	"""
	label = me.StringField(required=True, max_length=200)

	meta = {
		# 📝 Developer Note: use this to specify the name for your collection in MongoDB
		'collection': 'welcome'
	}
