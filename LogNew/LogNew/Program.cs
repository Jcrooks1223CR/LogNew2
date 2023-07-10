using System.Globalization;
using System.Text.Json.Nodes;
using System.Text.Json.Serialization;
using System.Reflection.Emit;
using static System.Net.WebRequestMethods;
using System.Diagnostics;
using System.Reflection.Metadata;
using System.Reflection.PortableExecutable;
using System.Xml.Linq;
using System.Collections.Generic;
using System.Runtime;
using System.IO;
using System;
using System.Security.Cryptography.X509Certificates;
using File = System.IO.File;
using static System.Net.Mime.MediaTypeNames;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Newtonsoft;
using System.ComponentModel;
using Microsoft.VisualBasic;

namespace LogNew
{
    public class LogData
    {
        public static void Main(string[] args)
        {
            dynamic logData = JsonConvert.DeserializeObject(File.ReadAllText(@".\logData.json"));
            dynamic logConfig = JsonConvert.DeserializeObject(File.ReadAllText(@".\logconfig.json"));
            string logFile = File.ReadAllText(@".\logfile.log");
            Format(logData, logConfig);

            static void Format(dynamic logData, dynamic logConfig)
            {

                foreach (JToken data in logConfig)
                {
                    dynamic config = data["config"];
                    dynamic component = data["component"];
                    dynamic console = data["config"]["console"];
                    dynamic level = data["config"]["console"]["level"];
                    dynamic publish = data["config"]["console"]["publish"];
                  
                     if (level == "debug")
                     {
                        
                         LogManager(logData, level, component);
                        break;
                     }
                     else if (level == "error")
                     {
                        LogManager(logData, level, component);
                        break;
                     }
                    else if (level == "warn")
                    {
                        LogManager(logData, level, component);
                        break;
                    }
                    else if (level == "info")
                    {
                        LogManager(logData, level, component);
                        break;
                    }
                    else if (level == "verbose")
                    {
                        LogManager(logData, level, component);
                        break;
                    }
                    else if (level == "http")
                    {
                        LogManager(logData, level, component);
                        break;
                    }
                    else if (level == "error" || level == "debug"|| level == "warn" || level == "info" || level == "verbose" || level == "http")
                    {
                        
                        LogManager(logData, level, component);
                        break;
                    }
                    
                }
                
            }

            static void LogManager(dynamic logData, dynamic level, dynamic component)
            {
                DateTime timeStamp = DateTime.Now;
                DayOfWeek dayOfWeek = timeStamp.DayOfWeek;
                dynamic comSource = $"{logData["source"]}";
                dynamic logMessage = $"{timeStamp.DayOfWeek} {timeStamp}\t- {level}\t- {logData["host"]}\t- {comSource}\t- {logData["correlationid"]}\t- {logData["code"]}\t- {logData["message"]}\n{"Http: "}{logData["http:"]}\n{logData["request"]}\n{logData["response"]}{logData["trace"]}\n{logData["data"]}";
                if (logMessage !=null)
                {
                    Console.WriteLine(component);
                    Console.WriteLine(level);
                   component = comSource;
                    Console.WriteLine(component);
                    Console.WriteLine(comSource);
                   Console.WriteLine($"Log Data Object:\n" + logMessage);
                }
                else if (logMessage == null)
                {
                    Environment.Exit(0);
                }
               // Console.WriteLine($"Log Data Object:\n" + logMessage);
                //Router(logMessage);
            }

            static void Router(dynamic logMessage)
            {

                /*
                    this function should define the format for a logMessage when published to the console.
                    this format will be standard for all log publishing to the console as part of this
                    solution.
                */
                if (logMessage == "error")
                {
                    //console.log('no message received') logging no message
                    Environment.Exit(0);
                }
                else if (logMessage == "debug")
                {

                    Console.WriteLine(logMessage);
                }
            }

            /* public class LogObject
             {
                 public DateTime timeStamp { get; set; }

                 public dynamic host { get; set; }

                 public string source { get; set; }

                 public string correlationId { get; set; }

                 public string code { get; set; }

                 public string message { get; set; }

                 public List <HTTP> http { get; set; }

                 public string trace { get; set; }

                 public List<string> data { get; set; }

                 public dynamic logData = JsonConvert.DeserializeObject(File.ReadAllText(@".\logData.json"));
                 public DateTime GetTimeStamp(DateTime timeStamp)
                 {
                     return timeStamp;
                 }
                 public void SetTimeStamp(DateTime timeStamp)
                 { 
                      timeStamp = timeStamp ;
                 }
                 public string GetHost(dynamic host)
                 {
                     return host;
                 }
                 public void SetHost(dynamic host)
                 {
                     this.host = $"{logData["host"]}";
                 }
                 public string GetSource(string source)
                 {
                     return source;
                 }
                 public void SetSource(string host)
                 {
                     this.source = source;
                 }

                 public string GetCorrelationId(string correlationId)
                 {
                     return correlationId;
                 }
                 public void SetCorrelationId(string correlationId)
                 {
                     this.correlationId = correlationId;
                 }

                 public string GetCode(string code)
                 {
                     return code;
                 }
                 public void SetCode(string code)
                 {
                     this.code = code;
                 }

                 public string GetMessage(string message)
                 {
                     return code;
                 }
                 public void SetMessage(string message)
                 {
                     this.code = code;
                 }

                 public string GetHttp(string http)
                 {
                     return http;
                 }
                 public void SetHttp(List<HTTP> http)
                 {
                     this.http = http;
                 }

                 public string GetTrace(string trace)
                 {
                     return trace;
                 }
                 public void SetTrace(string trace)
                 {
                     this.trace = trace;
                 }

                 public string GetData(string data)
                 {
                     return data;
                 }
                 public void SetData(List<string> data)
                 {
                     this.data = data;
                 }
             }

             public class HTTP 
             {
                 public string request { get; set; }

                 public string response { get; set; }

                 public string GetRequest(string request)
                 {
                     return request;
                 }
                 public void SetRequest(string request)
                 {
                     this.request = request;
                 }
                 public string GetResponse(string response)
                 {
                     return response;
                 }
                 public void SetResponse(string response)
                 {
                     this.response = response;
                 }
             }*/
        }
    }
}