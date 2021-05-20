using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sample.Chat.Services.Models
{
    public class UserModel
    {
        public string Id { get; set; }

        public string Email { get; set; }

        public string DisplayName { get; set; }

        public string Token { get; set; }

        public long ExpiresOn { get; set; }
    }

    public class CreateUserRequestModel
    {
    
        public string Email { get; set; }

 
        public string DisplayName { get; set; }
    }

    public class GetUserRequestModel
    {
     
        public string Email { get; set; }
    }
}
