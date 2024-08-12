/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "c5skk4xog5svafq",
    "created": "2024-08-12 02:54:23.543Z",
    "updated": "2024-08-12 02:54:23.543Z",
    "name": "tenants",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "ojyr1cye",
        "name": "name",
        "type": "text",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "ax4ow53y",
        "name": "pricingTier",
        "type": "select",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "maxSelect": 1,
          "values": [
            "basic",
            "pro",
            "enterprise"
          ]
        }
      }
    ],
    "indexes": [],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("c5skk4xog5svafq");

  return dao.deleteCollection(collection);
})
