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
	cost-threshold 0.01
	report-frequency daily

@events
cost

@aws
profile default
region us-east-1
  
