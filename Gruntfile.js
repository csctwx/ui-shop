module.exports = function(grunt) {

  require('jit-grunt')(grunt);

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-complexity');
  grunt.loadNpmTasks('grunt-war');
  grunt.loadNpmTasks('grunt-tomcat-deploy');
  grunt.loadNpmTasks('grunt-shell');

  grunt.initConfig({

    // Read the Grunt configuration file
    conf: grunt.file.readJSON('Gruntconfig.json'),

    // Task to clean the folders before building
    clean: {
      build: ['build'],
      tomcat: {
        options: {
          force: true
        },
        src: ['<%= conf.local_tomcat_dir %>/*']
      }
    },

    copy: {
      // Task to copy the src files to the build dir
      build: {
        files: [{
          expand: true,
          cwd: '.',
          src: ['**', '!backend-tests/**', '!build/**',
            '!BUILD-README.MD',
            '!Grunt/**', '!Gruntconfig.json', '!Gruntfile.js',
            '!logs/**', '!data/**', '!MockUps/**',
            '!node_modules/**', '!package.json', '!version.txt'
          ],
          dest: 'build'
        }]
      },
      // Task to copy the war file to the webapps tomcat dir
      tomcat: {
        files: [{
          src: 'build/<%= conf.war_filename %>',
          dest: '<%= conf.local_tomcat_dir %>/<%= conf.war_filename %>'
        }]
      }
    },

    // Task to minify all the JS files in the build/ dir
    uglify: {
      build: {
        files: [{
          expand: true,
          cwd: 'build/js',
          src: ['app/**.js', 'common/**.js'],
          dest: 'build/js'
        }]
      }
    },

    // Task to minify all the CSS files in the build/ dir
    cssmin: {
      build: {
        files: [{
          expand: true,
          cwd: 'build/css',
          src: '**/*.css',
          dest: 'build/css',
        }]
      }
    },

    // Task to minify all the HTML files in the build/ dir
    htmlmin: {
      build: {
        options: {
          removeComments: true,
          collapseWhitespace: true
        },
        files: [{
          expand: true,
          cwd: 'build',
          src: '**/*.html',
          dest: 'build',
        }]
      }
    },

    // Tasks to analyse the Javascript code
    jshint: {
      all: ['js/app/**.js', '!js/app/**.min.js', 'js/common/**.js',
        '!js/common/**.js'
      ]
    },
    complexity: {
      simple: {
        src: ['js/app/**.js', 'js/common/**.js'],
        options: {
          breakOnErrors: true,
          errorsOnly: false, // show only maintainability errors
          cyclomatic: [3, 7, 12], // or optionally a single value, like 3
          halstead: [8, 13, 20], // or optionally a single value, like 8
          maintainability: 100,
          hideComplexFunctions: true, // only display maintainability
          broadcast: false // broadcast data over event-bus
        }
      },
      generic: {
        src: ['js/app/**.js', 'js/common/**.js'],
        options: {
          breakOnErrors: true,
          errorsOnly: false, // show only maintainability errors
          cyclomatic: [3, 7, 12], // or optionally a single value, like 3
          halstead: [8, 13, 20], // or optionally a single value, like 8
          maintainability: 100,
          hideComplexFunctions: false, // only display maintainability
          broadcast: false // broadcast data over event-bus
        }
      }
    },

    // Build a WAR (web archive) without Maven or the JVM installed
    war: {
      build: {
        options: {
          war_verbose: true,
          war_dist_folder: 'build', // Folder where to generate the WAR
          war_name: 'shop' // The name fo the WAR file (.war will be the extension)
        },
        files: [{
          expand: true,
          cwd: 'build',
          src: ['**'],
          dest: ''
        }]
      }
    },

    // Task to deploy the war to a tomcat server (for testing)
    tomcat_deploy: {
      host: '<%= conf.remote_tomcat_host %>',
      login: '<%= conf.remote_tomcat_user %>',
      password: '<%= conf.remote_tomcat_pass %>',
      path: '<% conf.remote_tomcat_path %>',
      war: 'build/<%= conf.war_filename %>',
      port: '<%= conf.remote_tomcat_port %>',
      dist: 'dist',
      deploy: '/manager/text/deploy',
      undeploy: '/manager/text/undeploy',
    },

    shell: {
      // Task to output the list of files in the generated war
      lswar: {
        command: 'unzip -vl build/<%= conf.war_filename %>'
      },
      // Create the release in the desired format used on eForge
      release: {
        command: [
          'cd build',
          'rm -rf <%= conf.release_foldername %>',
          'mkdir <%= conf.release_foldername %>',
          'cp <%= conf.war_filename %> <%= conf.release_foldername %>/',
          'zip -q -r <%= conf.release_foldername %>.zip <%= conf.release_foldername %>',
          'cd ..',
          'echo \"build/<%= conf.release_foldername %>.zip created without errors.\"'
        ].join('&&')
      },
      // Create the release in the desired format for Jenkins
      releaseJenkins: {
        command: [
          'cd build',
          'rm -rf <%= conf.release_foldername %>',
          'mkdir <%= conf.release_foldername %>',
          'cp <%= conf.war_filename %> <%= conf.release_foldername %>/',
          'cp version <%= conf.release_foldername %>/version',
          'zip -q -r <%= conf.release_foldername %>.zip <%= conf.release_foldername %>',
          'rm -rf <%= conf.release_foldername %>',
          'mkdir -p Deliverables-SHOP-R2dev',
          'mv <%= conf.release_foldername %>.zip Deliverables-SHOP-R2dev',
          'cp version Deliverables-SHOP-R2dev/version',
          'zip -q -r Deliverables-SHOP-R2dev.zip Deliverables-SHOP-R2dev',
          'cd ..',
          'echo \"build/Deliverables-SHOP-R2dev.zip created without errors.\"'
        ].join('&&')
      },
      version: {
        command: [
          './Grunt/version.sh'
        ].join('&&')
      },
      // Task to execute the tests for the backend
      testbackend: {
        command: [
          'cd backend-tests',
          './newman.sh | grep -B 1 FAIL; cd ..',
        ].join('&&')
      }
    },
    // Execute tasks automatically when a file change is detected
    watch: {
      jshint: {
        files: ['js/app/**.js', 'js/common/**.js'],
        tasks: ['jshint'],
        options: {
          spawn: false,
        },
      },
    },

    // Tasks to bump the version number
    // first increment the last version number in the version.txt file
    'string-replace': {
      inline: {
        files: {
          'version.txt': 'version.txt'
        },
        options: {
          replacements: [{
            pattern: /SHOP R1\.4\.1\.(.*)/ig,
            replacement: function(match, p1) {
              var next_version = Number(p1) + 1;
              grunt.log.write("incrementing version number from " +
                p1 + " to " + next_version + "\n");
              return 'SHOP R1.4.1.' + next_version;
            }
          }]
        }
      }
    },
    // then create a git commit fixing the version and push the code
    gitcommit: {
      your_target: {
        options: {
          message: '<%= grunt.file.read(\'version.txt\') %>'
        },
        files: [{
          src: ['**', '!backend-tests/**', '!build/**',
            '!logs/**', '!node_modules/**'
          ]
        }]
      }
    },
    // https://github.com/sindresorhus/pageres
    // http://spirelightmedia.com/resources/responsive-design-device-resolution-reference
    pageres: {
      sprint_home: {
        options: {
          delay: 2,
          urls: 'http://vm4-msdp.test.prepaid.sprint.com/#!/',
          sizes: ['1280x1024', '800x400', '480x360'],
          dest: 'screenshots',
          filename: 'sprint-home-{{size}}'
        }
      },
      sprint_shop_phones: {
        options: {
          delay: 5,
          urls: 'http://vm4-msdp.test.prepaid.sprint.com/#!/shop/phones/@/',
          sizes: ['1280x1024', '800x400', '480x360'],
          dest: 'screenshots',
          filename: 'sprint-shop-phones-{{size}}'
        }
      },
      sprint_shop_plans: {
        options: {
          delay: 2,
          urls: 'http://vm4-msdp.test.prepaid.sprint.com/#!/shop/plans/@/',
          sizes: ['1280x1024', '800x400', '480x360'],
          dest: 'screenshots',
          filename: 'sprint-shop-plans-{{size}}'
        }
      },
      sprint_additionalservices: {
        options: {
          delay: 2,
          urls: 'http://vm4-msdp.test.prepaid.sprint.com/#!/plans/additionalservices/',
          sizes: ['1280x1024', '800x400', '480x360'],
          dest: 'screenshots',
          filename: 'sprint-additionalservices-{{size}}'
        }
      },
      boost_home: {
        options: {
          delay: 2,
          urls: 'http://vm4-msdp.test.boostmobile.com/#!/',
          sizes: ['1280x1024', '800x400', '480x360'],
          dest: 'screenshots',
          filename: 'boost-home-{{size}}'
        }
      },
      boost_shop_phones: {
        options: {
          delay: 5,
          urls: 'http: //vm4-msdp.test.boostmobile.com/#!/shop/phones/',
          sizes: ['1280x1024', '800x400', '480x360'],
          dest: 'screenshots',
          filename: 'boost-shop-phones-{{size}}'
        }
      },
      boost_shop_hotspots: {
        options: {
          delay: 2,
          urls: 'http: //vm4-msdp.test.boostmobile.com/#!/shop/hotspots/',
          sizes: ['1280x1024', '800x400', '480x360'],
          dest: 'screenshots',
          filename: 'boost-shop-hotspots-{{size}}'
        }
      }
    }
  });

  // Simple build, just copy the files and add them to the war
  grunt.registerTask("build", ['clean:build', 'copy:build', 'war']);

  // Build + create the shop.war in the eForge release format
  grunt.registerTask("build-release", ['clean:build', 'copy:build', 'war',
    'shell:release'
  ]);

  // Build + create the shop.war in the Jenkins release format
  grunt.registerTask("build-jenkins", ['clean:build', 'copy:build', 'war',
    'shell:release'
  ]);

  // Do the build and send the war file to the local tomcat /webapps directory
  grunt.registerTask("build-tomcat", ['clean:build', 'clean:tomcat',
    'copy:build', 'war', 'copy:tomcat'
  ]);

  // Build + Minify all the files before adding them to the war file
  grunt.registerTask("build-min", ['clean:build', 'copy:build', 'uglify',
    'cssmin', 'htmlmin', 'war'
  ]);

  // Task to execute the Postman APIs testing for the backend
  grunt.registerTask('test-backend', ['shell:testbackend']);

  // Default task is the simple build
  grunt.registerTask('default', ['build']);

};
