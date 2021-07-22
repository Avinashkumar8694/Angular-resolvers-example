module.exports = function (grunt) {
    grunt.initConfig({
        ts: {
            default: {
                tsconfig: './tsconfig.json'
            }
        },
        copy: {
            files: {
                cwd: 'src/angular-app',  // set working folder / root to copy
                src: '**/*',           // copy all files and subfolders
                dest: 'build/angular-app',    // destination folder
                expand: true
            }
        }
    });
    grunt.loadNpmTasks("grunt-ts");
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.registerTask("default", ["ts", "copy"]);
};