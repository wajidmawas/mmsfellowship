using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;

namespace mmsfellowship
{
    public class clsAnswers
    {
        public string Answer { get; set; }
        public string Question { get; set; }
    }

    public class clsSignInPetition
    {
        public string MobileNo { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string ZipCode { get; set; }
        public string Reason { get; set; }
        public string pageId { get; set; }
    }
    public class clsMasters
    {
        public int Type { get; set; }
        public int UserId { get; set; }
        public int FilterId { get; set; }
        public string ClientId { get; set; }
    }
    public class clsMasterFilters
    {
        public int Type { get; set; }
        public int UserId { get; set; }
        public int FilterId { get; set; }
    }

    public class TransactResult
    {
        public string Status { get; set; }
        public string Message { get; set; }
        public object objresult { get; set; }
    }
    public class Common
    {
        public static void InfoLogs(string Message)
        {
            try
            {

                string appPath = AppDomain.CurrentDomain.BaseDirectory + "Logs";
                //if (System.Configuration.ConfigurationManager.AppSettings["LogErrorType"].ToString() == "File")
                //{
                if (!Directory.Exists(appPath))
                {
                    DirectoryInfo di = Directory.CreateDirectory(appPath);
                }
                string Filename = "APPServiceLog" + DateTime.Now.ToString("dd-MM-yyyy"); //dateAndTime.ToString("dd/MM/yyyy")
                string fullpath = appPath + "\\" + Filename + ".txt";

                if (!File.Exists(fullpath))
                {
                    System.IO.FileStream f = System.IO.File.Create(fullpath);
                    f.Close();
                    TextWriter tw = new StreamWriter(fullpath);
                    tw.WriteLine(DateTime.Now + " " + Message);
                    tw.Close();
                }
                else if (File.Exists(fullpath))
                {
                    using (StreamWriter w = File.AppendText(fullpath))
                    {
                        w.WriteLine(DateTime.Now + " " + Message);
                        w.Close();
                    }
                }
                // }
            }
            catch
            {
            }

        }
    }
}