module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    less: {
      production: {
        options: {
          paths: ["public/stylesheets/less"],
          yuicompress: true,
          cleancss: true
        },
        files: {"public/stylesheets/style.css": "public/stylesheets/less/style.less"}
      }
    },

    watch: {
        less:{
          files: "public/stylesheets/less/*.less",
          tasks: ["less"]
        }
      }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-less');

  // Default task(s).
  grunt.registerTask('default', ['less']);

};