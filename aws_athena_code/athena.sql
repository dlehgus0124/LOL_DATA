CREATE EXTERNAL TABLE IF NOT EXISTS `win_lose_champ`.`win_lose_champ` (
  `win_champ` varchar(512),
  `lose_champ` varchar(512),
  `win_tags` varchar(512),
  `lose_tags` varchar(512)
)
ROW FORMAT SERDE 'org.apache.hadoop.hive.serde2.OpenCSVSerde'
WITH SERDEPROPERTIES (
  'separatorChar' = ',',
  'quoteChar' = '\"',
  'escapeChar' = '\n'
)
STORED AS INPUTFORMAT 'org.apache.hadoop.mapred.TextInputFormat' OUTPUTFORMAT 'org.apache.hadoop.hive.ql.io.HiveIgnoreKeyTextOutputFormat'
LOCATION 's3://riot.data/position_select/'
TBLPROPERTIES ('classification' = 'csv');