/**
 * core collectionsFS configurations
 */
FS.HTTP.setBaseUrl("/assets");
FS.HTTP.setHeadersForGet([
  ["Cache-Control", "public, max-age=31536000"]
]);

/**
 * Define CollectionFS collection
 * See: https://github.com/CollectionFS/Meteor-CollectionFS
 * chunkSize: 1024*1024*2; <- CFS default // 256k is default GridFS chunk size, but performs terribly
 */

export const Media = new FS.Collection("Media", {
  stores: [
    new FS.Store.GridFS("image", {
      chunkSize: 1 * 1024 * 1024
    })
  ],
  filter: {
    allow: {
      contentTypes: ["image/*"]
    }
  }
});
