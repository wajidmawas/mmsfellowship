using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Data.SqlClient;
using System.Collections;
using System.IO;

namespace mmsfellowship
{
    public class ServiceActionHelper
    {
        static string strDBConn = System.Configuration.ConfigurationManager.AppSettings["connectionString"].ToString();
            
        
        public static DataSet ExecuteSP(ArrayList obj,string spName)
        {
            try
            {

                return SQLHelper.ExecuteDataset(strDBConn, spName, obj.ToArray()); 

            }
            catch (Exception ex)
            {
                return null;
            }
        }
    }
}