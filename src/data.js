/* global $, moment */

import utils from './utils.js';

function load () {
  const apiUrl = 'https://www.ameliamusicalplayhouse.com/wp-json/wp/v2/productions/';
  let urlParams = new URLSearchParams(window.location.search);
  let postId = urlParams.get('id');
  let p = $.ajax({
    url: apiUrl + postId,
    method: 'GET'
  });
  return p;
}

function convert (data) {
  let bgColor = data.acf.amp_production_media_background_color || 'black';
  let color = data.acf.amp_production_media_text_color || 'white';
  let sponsoredBy = utils.stripHtml((data.acf.amp_event_sponsors[0] || {}).amp_event_sponsor_name || '');
  let billing = window.btoa(data.acf.amp_production_trimmed_billing || data.acf.amp_production_shortened_billing || data.acf.amp_production_full_billing || '');
  let licensingCredit = utils.lineBreaksToHtml(data.acf.amp_production_licensing_credit_trimmed || data.acf.amp_production_licensing_credit || '');

  // Dates
  let dates = data.acf.amp_event_dates_times || [];
  let dateRange;
  if (dates.length > 0) {
    let parseFormat = 'MMMM D, YYYY h:m a';
    let displayFormat = 'MMMM D';
    let displayFormat2 = 'D';
    let displayFormat3 = 'MMM D';
    if (dates.length > 1) {
      dates.sort((a, b) => {
        let amd = moment(a.amp_event_date_time, parseFormat);
        let bmd = moment(b.amp_event_date_time, parseFormat);
        return (amd > bmd) ? 1 : -1;
      });
      let first = moment(dates[0].amp_event_date_time, parseFormat);
      let last = moment(dates[dates.length - 1].amp_event_date_time, parseFormat);
      if (first.month() === last.month()) {
        dateRange = first.format(displayFormat) + ' – ' + last.format(displayFormat2);
      } else {
        dateRange = first.format(displayFormat3) + ' – ' + last.format(displayFormat3);
      }
    } else {
      let single = moment(dates[0].amp_event_date_time, parseFormat);
      dateRange = single.format(displayFormat);
    }
  }

  // Images / Show Logo
  let imageUrls = data.acf.amp_production_media_images || [];

  // Hacks
  // See also _redirects
  if (window.location.hostname !== 'localhost') {
    for (let i = 0; i < imageUrls.length; i++) {
      imageUrls[i] = (imageUrls[i] || '').replace('https://www.ameliamusicalplayhouse.com/wp-content', '');
    }
  }

  // Result
  let options = {
    textColor: (color || '').replace('#', ''),
    backgroundColor: (bgColor || '').replace('#', ''),
    productionTitle: data.title.rendered,
    dates: dateRange || '',
    billing: billing || '',
    licensingCredit: licensingCredit || '',
    sponsoredBy: sponsoredBy || '',
    imageUrls: imageUrls
  };

  return options;
}

let data = {
  load: load,
  convert: convert
};

export default data;
