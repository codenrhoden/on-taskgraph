// Copyright 2015-2016, EMC, Inc.

'use strict';

module.exports = {
    friendlyName: 'Install CentOS',
    injectableName: 'Graph.InstallCentOS',
    options: {
        defaults: {
            // Make sure this matches for both the install-os task and the
            // rackhd-callback-uri-wait task, so put it in "defaults"
            completionUri: 'renasar-ansible.pub',
            version: null,
            repo: '{{api.server}}/centos/{{options.version}}/os/x86_64'
        },
        'install-os': {
            schedulerOverrides: {
                timeout: 3600000 // 1 hour
            }
        },
        'rackhd-callback-uri-wait': {
            schedulerOverrides: {
                timeout: 1200000 // 20 minutes
            }
        },
        'validate-ssh': {
            retries: 10
        }
    },
    tasks: [
        {
            label: 'set-boot-pxe',
            taskName: 'Task.Obm.Node.PxeBoot',
            ignoreFailure: true
        },
        {
            label: 'reboot',
            taskName: 'Task.Obm.Node.Reboot',
            waitOn: {
                'set-boot-pxe': 'finished'
            }
        },
        {
            label: 'install-os',
            taskName: 'Task.Os.Install.CentOS',
            waitOn: {
                'reboot': 'succeeded'
            }
        },
        {
            label: 'rackhd-callback-uri-wait',
            taskName: 'Task.Wait.Completion.Uri',
            waitOn: {
                'install-os': 'succeeded'
            }
        },
        {
            label: 'validate-ssh',
            taskName: 'Task.Ssh.Validation',
            waitOn: {
                'rackhd-callback-uri-wait': 'succeeded'
            }
        }
    ]
};
