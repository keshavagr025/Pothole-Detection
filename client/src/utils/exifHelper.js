/**
 * EXIF GPS Extractor for Mobile & Dashcam Photos
 * Automatically reads GPS Latitude, Longitude, and Capture Date
 * directly from image file EXIF metadata tags.
 */
import EXIF from 'exif-js';

export function extractExifGPS(file) {
  return new Promise((resolve) => {
    try {
      EXIF.getData(file, function () {
        const latData = EXIF.getTag(this, 'GPSLatitude');
        const latRef = EXIF.getTag(this, 'GPSLatitudeRef') || 'N';
        const lonData = EXIF.getTag(this, 'GPSLongitude');
        const lonRef = EXIF.getTag(this, 'GPSLongitudeRef') || 'E';
        const dateTime = EXIF.getTag(this, 'DateTimeOriginal') || EXIF.getTag(this, 'DateTime');

        if (latData && lonData) {
          const lat = convertDMSToDD(latData[0], latData[1], latData[2], latRef);
          const lon = convertDMSToDD(lonData[0], lonData[1], lonData[2], lonRef);

          resolve({
            success: true,
            latitude: +lat.toFixed(6),
            longitude: +lon.toFixed(6),
            dateTime,
            source: 'Photo EXIF Geotag'
          });
        } else {
          resolve({ success: false, reason: 'No embedded GPS tags in photo' });
        }
      });
    } catch (err) {
      resolve({ success: false, error: err.message });
    }
  });
}

function convertDMSToDD(degrees, minutes, seconds, direction) {
  let dd = degrees + minutes / 60 + seconds / (60 * 60);
  if (direction === 'S' || direction === 'W') {
    dd = dd * -1;
  }
  return dd;
}
