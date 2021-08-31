let { toLogicalID } = require('@architect/utils')
let validate = require('./validate')


module.exports = function costDetection (arc, cfn) {

  console.log('cost detection macro started')
  let costAnomalyDetection = arc['cost-detection']
  console.log('cost detection found')

  // Only run if @cost-detection is defined
  if (costAnomalyDetection) {

    // Validate the specified format
    // TODO: validate(costAnomalyDetection)

    /*
    cfn.Resources.CustomAnomalyMonitorWithLinkedAccount = {
      Type: 'AWS::CE::AnomalyMonitor',
      Properties: {
        MonitorName: 'MonitorName',
        MonitorType: 'CUSTOM',
        MonitorSpecification:  {
          Dimensions: {
            Key: 'LINKED_ACCOUNT',
            Values: [ '123456789012', '123456789013' ]
          }
        }
      }
    }
    */

    cfn.Resources.AnomalyServiceMonitor = {
      Type: 'AWS::CE::AnomalyMonitor',
      Properties: {
        MonitorName: 'MonitorName',
        MonitorType: 'DIMENSIONAL',
        MonitorDimension: 'SERVICE'
      }
    }

    cfn.Resources.AnomalySubscription = {
      Type: 'AWS::CE::AnomalySubscription',
      Properties: {
        SubscriptionName: 'SubscriptionName',
        Threshold: 100,
        Frequency: 'DAILY',
        MonitorArnList: [
          'CustomAnomalyMonitorWithLinkedAccount',
          'AnomalyServiceMonitor'
        ],
        Subscribers: [
          {
            Type: 'EMAIL',
            Address: 'ryan.bethel@begin.com'
          }
        ]
      }
    }

  }

  console.log(cfn)

  return cfn
}
