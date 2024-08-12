/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("l3hgkpogneuz1ow")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "i0gjhont",
    "name": "tenantId",
    "type": "relation",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "c5skk4xog5svafq",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": null
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("l3hgkpogneuz1ow")

  // remove
  collection.schema.removeField("i0gjhont")

  return dao.saveCollection(collection)
})
