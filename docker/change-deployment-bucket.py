import yaml
import io
import sys

with open("serverless.yml", 'r') as stream:
  data_loaded = yaml.load(stream)
  service_name = data_loaded['service']

  data_loaded['provider']['deploymentBucket'] = sys.argv[1]

  with io.open('serverless.yml', 'w', encoding='utf8') as outfile:
    yaml.dump(data_loaded, outfile, default_flow_style=False, allow_unicode=True)

  