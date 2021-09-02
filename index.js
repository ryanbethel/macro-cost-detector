let { toLogicalID } = require('@architect/utils')


module.exports = function costDetection (arc, cfn) {

  let costAnomalyDetection = arc['cost-detection']

  if (costAnomalyDetection) {

    costAnomalyDetection.forEach(monitor => {
      let name = Object.keys(monitor)[0]
      let accounts = monitor[name]?.accounts
      let service = monitor[name]?.service
      let email = monitor[name]?.email
      let sns = monitor[name]?.sns
      let threshold = monitor[name]?.['cost-threshold']
      let frequency = monitor[name]?.['report-frequency']
      let ID = toLogicalID(name)


      if (accounts){
        cfn.Resources[ID + 'AccountsMonitor'] = {
          Type: 'AWS::CE::AnomalyMonitor',
          Properties: {
            MonitorName: ID + 'Accounts',
            MonitorType: 'CUSTOM',
            MonitorSpecification:
            ` { "Dimensions" : { "Key" : "LINKED_ACCOUNT", "Values" : ["${Array.isArray(accounts) ? accounts.join('", "') : accounts}"]  } }`
          }
        }
      }

      if (service){
        cfn.Resources[ID + 'ServiceMonitor'] = {
          Type: 'AWS::CE::AnomalyMonitor',
          Properties: {
            MonitorName: ID + 'Service',
            MonitorType: 'DIMENSIONAL',
            MonitorDimension: 'SERVICE'
          }
        }
      }

      if (email || sns){
        let frequencyValue = frequency === 'immediate'  ?
          'IMMEDIATE' : frequency === 'weekly' ? 'WEEKLY' : 'DAILY'
        let thresholdValue = threshold || 10
        let emailValue = email ?  [ { Type: 'EMAIL', Address: email } ] : []
        let snsValue = sns ?  [ { Type: 'SNS', Address: { Ref: toLogicalID(sns) + 'EventTopic' } } ] : []
        let MonitorArnList = []
        if (service) MonitorArnList.push( { Ref: ID + 'ServiceMonitor' })
        if (accounts) MonitorArnList.push( { Ref: ID + 'AccountsMonitor' })
        cfn.Resources[ID + 'AnomalySubscription'] = {
          Type: 'AWS::CE::AnomalySubscription',
          Properties: {
            SubscriptionName: ID + 'Subscription',
            Threshold: thresholdValue,
            Frequency: frequencyValue,
            MonitorArnList,
            Subscribers: [ ...emailValue, ...snsValue ]
          }
        }

      }
    })
  }

  return cfn
}
