
using System.Linq;

using AutoMapper;

using Sample.Chat.Entities;
using Sample.Chat.Services.Models;

namespace Sample.Chat.Services.Mappers
{
    public class ThreadProfile: Profile
    {
        public ThreadProfile()
        {
            CreateMap<Thread, ThreadResponseModel>()
                .ForMember(dest => dest.Participants, options => options.MapFrom(src => src.Participants.Select(participant => new Participant
                {
                    DisplayName = participant.User.DisplayName,
                })));
        }
    }
}
