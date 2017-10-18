# mup-databackup: Meteor-up plugin to backup application data.

## How to use:
1. Install the plugin globally:
    ```
    npm install -g nzomedia/mup-databackup
    ```

2. Edit your _mup.js_ file:

    Add the plugin to the `plugins` property:

    ```
    File mup.js:
    ...
    plugins: [
    "mup-databackup"
    ],
    ...
    ```

3. Define the backup configuration:

    Inside _mup.js_, add a property named `databackup`. It should contain a `servers` property containing 
    a list of defined servers.

    For each target server, define the paths you whish to backup.<br>
    And the destination folder inside the host file system. 
    Here is a sample configuration:
    ```
    File mup.js:
    ...
    databackup: {
    servers: {
        one: {
        sourcePaths: [
            "/opt/myApp/app-data",
            "/opt/myApp/config"
        ],
        destinationPath: "/opt/backup"
        }
    }
    }
    ...
    ```
    **Explaination:**
    + `databackup.servers`: is like an array of servers containing data to backup.
        The array should have at least one entry.
    + `one`: Is the name of a previously defined server in _mup.js_ it could be `two` or `three`, etc.
    + `sourcePaths`: is required, it's an array of paths to backup. There should be at least one entry.
    + `destinationPath`: is required, it indicates where to store backups.

4. In the CLI run:
    ```
    mup databackup backup
    ```

**What happens next ?**

For each specified server, the mentioned paths are archived and compressed individually. The result is stored inside the `destinationPath` and in a *folder with a name taken from the present date.

*: The backup folder's name has the form: _YYYY-MM-dd_HH-mm-ss_ we use the bash command `date +"%Y-%m-%d_%H-%M-%S"` to produce it.

Exemple backup folder name: 2017-10-11_15-26-58/

And inside the backup folder each backed up path has a name derived from its original path.<br>
The forward slashes in the path are replaced with dashes.<br>
So for exemple:

if we have in _mup.js_:
```
...
sourcePaths: ["/opt/myapp/config" ],
destinationPath: "/opt/backup/"
...
```
That will produce for instance:

**/opt/backup**/<YYYY-MM-dd_HH-mm-ss>/**opt-myapp-config.tar.gz**

And that's it.

## TODO:
+ Restore data
+ Test