using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sample.Chat.Entities
{
    public class Attachment
    {
        public Guid Id { get; set; }

        public string Name { get; set; }

        public string ContentType { get; set; }

        public long Size { get; set; }

        public string Uri { get; set; }

        public DateTimeOffset CreatedAt { get; set; }
    }
}
