import { YAML } from '.'

const cfg = {
    Organizations: [
        {
            '&OrdererOrg': {
                Name: 'OrdererOrg',
                ID: 'OrdererMSP',
                MSPDir: '../organizations/ordererOrganizations/example.com/msp',
                Policies: {
                    Readers: {
                        Type: 'Signature',
                        Rule: "OR('OrdererMSP.member')"
                    },
                    Writers: {
                        Type: 'Signature',
                        Rule: "OR('OrdererMSP.member')"
                    },
                    Admins: {
                        Type: 'Signature',
                        Rule: "OR('OrdererMSP.admin')"
                    }
                },
                OrdererEndpoints: ['orderer.example.com:7050']
            }
        },
        {
            '&Org1': {
                Name: 'Org1MSP',
                ID: 'Org1MSP',
                MSPDir: '../organizations/peerOrganizations/org1.example.com/msp',
                Policies: {
                    Readers: {
                        Type: 'Signature',
                        Rule: "OR('Org1MSP.admin', 'Org1MSP.peer', 'Org1MSP.client')"
                    },
                    Writers: {
                        Type: 'Signature',
                        Rule: "OR('Org1MSP.admin', 'Org1MSP.client')"
                    },
                    Admins: {
                        Type: 'Signature',
                        Rule: "OR('Org1MSP.admin')"
                    },
                    Endorsement: {
                        Type: 'Signature',
                        Rule: "OR('Org1MSP.peer')"
                    },
                    AnchorPeers: [
                        {
                            Host: 'peer0.org1.example.com',
                            Port: 7051
                        }
                    ]
                }
            }
        },
        {
            '&Org2': {
                Name: 'Org2MSP',
                ID: 'Org2MSP',
                MSPDir: '../organizations/peerOrganizations/org2.example.com/msp',
                Policies: {
                    Readers: {
                        Type: 'Signature',
                        Rule: "OR('Org2MSP.admin', 'Org2MSP.peer', 'Org2MSP.client')"
                    },
                    Writers: {
                        Type: 'Signature',
                        Rule: "OR('Org2MSP.admin', 'Org2MSP.client')"
                    },
                    Admins: {
                        Type: 'Signature',
                        Rule: "OR('Org2MSP.admin')"
                    },
                    Endorsement: {
                        Type: 'Signature',
                        Rule: "OR('Org2MSP.peer')"
                    },
                    AnchorPeers: [
                        {
                            Host: 'peer0.org2.example.com',
                            Port: 7051
                        }
                    ]
                }
            }
        }
    ],
    Capabilities: {
        Channel: { '&ChannelCapabilities': { V2_0: true } },
        Orderer: { '&OrdererCapabilities': { V2_0: true } },
        Application: { '&ApplicationCapabilities': { V2_0: true } }
    },
    Application: {
        '&ApplicationDefaults': {
            Policies: {
                Readers: {
                    Type: 'ImplicitMeta',
                    Rule: 'ANY Readers'
                },
                Writers: {
                    Type: 'ImplicitMeta',
                    Rule: 'ANY Writers'
                },
                Admins: {
                    Type: 'ImplicitMeta',
                    Rule: 'MAJORITY Admins'
                },
                LifecycleEndorsement: {
                    Type: 'ImplicitMeta',
                    Rule: 'MAJORITY Endorsement'
                },
                Endorsement: {
                    Type: 'ImplicitMeta',
                    Rule: 'MAJORITY Endorsement'
                }
            },
            Capabilities: { '<merge>': 'ApplicationCapabilities' }
        }
    },
    Orderer: {
        '&OrdererDefaults': {
            OrdererType: 'etcdraft',
            EtcdRaft: {
                Consenters: [
                    {
                        Host: 'orderer.example.com',
                        Port: 7050,
                        ClientTLSCert:
                            '../organizations/ordererOrganizations/example.com/orderers/orderer.example.com/tls/server.crt',
                        ServerTLSCert:
                            '../organizations/ordererOrganizations/example.com/orderers/orderer.example.com/tls/server.crt'
                    }
                ]
            },
            BatchTimeout: '2s',
            BatchSize: {
                MaxMessageCount: 10,
                AbsoluteMaxBytes: '99 MB',
                PreferredMaxBytes: '512 KB'
            },
            Policies: {
                Readers: {
                    Type: 'ImplicitMeta',
                    Rule: 'ANY Readers'
                },
                Writers: {
                    Type: 'ImplicitMeta',
                    Rule: 'ANY Writers'
                },
                Admins: {
                    Type: 'ImplicitMeta',
                    Rule: 'MAJORITY Admins'
                },
                BlockValidation: {
                    Type: 'ImplicitMeta',
                    Rule: 'ANY Writers'
                }
            }
        }
    },
    Channel: {
        '&ChannelDefaults': {
            Policies: {
                Readers: {
                    Type: 'ImplicitMeta',
                    Rule: 'ANY Readers'
                },
                Writers: {
                    Type: 'ImplicitMeta',
                    Rule: 'ANY Writers'
                },
                Admins: {
                    Type: 'ImplicitMeta',
                    Rule: 'MAJORITY Admins'
                }
            },
            Capabilities: { '<merge>': 'ChannelCapabilities' }
        }
    },
    Profiles: {
        TwoOrgsOrdererGenesis: {
            '<merge>': 'ChannelDefaults',
            Orderer: {
                '<merge>': 'OrdererDefaults',
                Organizations: ['*OrdererOrg'],
                Capabilities: { '<merge>': 'OrdererCapabilities' }
            },
            Consortiums: {
                SampleConsortium: { Organizations: ['*Org1', '*Org2'] }
            }
        },
        TwoOrgsChannel: {
            Consortium: 'SampleConsortium',
            '<merge>': 'ChannelDefaults',
            Application: {
                '<merge>': 'ApplicationDefaults',
                Organizations: ['*Org1', '*Org2'],
                Capabilities: { '<merge>': 'ApplicationCapabilities' }
            }
        }
    }
}

test('test YAML', () => {
    const output = YAML.generate(cfg)

    log.info(output)
})
