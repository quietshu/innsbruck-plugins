/**
 * Created by shuding on 5/24/16.
 * <ds303077135@gmail.com>
 */

const fs   = require('fs');
const path = require('path');

module.exports = {
  db:     null,
  root:   null,
  init:   (_db, _rootDir) => {
    this.db = _db;
    this.root = _rootDir;
  },
  render: (template, options) => {
    let cname   = options.blog.plugin ? options.blog.plugin['cname'] || '' : '';
    let context = {};

    if (template == 'settings') {
      // settings page

      // include font-awesome
      context.head =
        `<link rel="stylesheet" href="http://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.4.0/css/font-awesome.min.css">`;

      context.settings = `<div class="input-group">
          <h5>
            CNAME
            <a class="fa fa-exclamation-circle" href="https://help.github.com/articles/using-a-custom-domain-with-github-pages/" title="see Github pages custom CNAME document"></a>
          </h5>
          <p><input type="text" name="plugin.cname" placeholder="your.blog (without http:// or https://)" value="${cname}"></p>
        </div>`;
      // All <input name='plugin.xxx'> will write the data into DB automatically
    }

    return context;
  },
  hook:   {
    onSetting: () => {
      // called after
      let cname = this.db.object.blog.plugin ? this.db.object.blog.plugin['cname'] || '' : '';
      let cnamePath = path.join(this.root, 'CNAME');
      if (!cname) {
        // empty, remove the CNAME file
        if (fs.existsSync(cnamePath)) {
          fs.unlinkSync(cnamePath);
        }
      } else {
        // write to ../CNAME
        fs.writeFileSync(cnamePath, cname);
      }
    }
  }
};
