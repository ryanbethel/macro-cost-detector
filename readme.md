# Architect Macro for AWS cost anomaly detection


## Email monitor
```
@app
cost-test

@http
get /

@macros
cost-macro

@cost-detection
monitor-name
  email "ryan.bethel@begin.com"
  service true
  cost-threshold 1
  report-frequency daily

```
 


## SNS monitor
```
@app
cost-test

@http
get /

@macros
cost-macro

@cost-detection
monitor-name
  sns cost
  service true
  cost-threshold 1
  report-frequency immediate


@event
cost
```
 

 

