
using System;
using System.Linq;

using AutoMapper;

using Azure.Communication;
using Azure.Communication.Chat;

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
                    Id = participant.UserId,
                    DisplayName = participant.User.DisplayName,

                }).ToList()));

            CreateMap<Thread, CreateThreadResponseModel>()
               .ForMember(dest => dest.Participants, options => options.MapFrom(src => src.Participants.Select(participant => new Participant
               {
                   Id = participant.UserId,
                   DisplayName = participant.User.DisplayName,
               }).ToList()));


            CreateMap<CommunicationUserIdentifier, CommunicationUserIdentifierModel>()
                .ForMember(dest => dest.CommunicationUserId, options => options.MapFrom(src => src.Id))
                .ForMember(dest => dest.Kind, options => options.MapFrom(src => "communicationUser"));

            CreateMap<ChatParticipant, ChatParticipantModel>()
                .ForMember(dest => dest.Id, options => options.Ignore());

            CreateMap<ChatMessageContent, ChatMessageContentModel>()
                .ForMember(dest => dest.ChatParticipant, options => options.Ignore());

            CreateMap<ChatMessageContent, ChatMessageContentModel>()
                .ForMember(dest => dest.initiator, options => options.Ignore());


            CreateMap<ChatMessage, ChatMessageModel>()
                .ForMember(dest => dest.Content, options => options.MapFrom(src => src.Content))
                .ForMember(dest => dest.Sender, options => options.Ignore())
                .ForMember(dest => dest.Type, options => options.MapFrom(src => src.Type.ToString()))
                .ForMember(dest => dest.CreatedOn, options => options.MapFrom(src => src.CreatedOn.ToUnixTimeSeconds() * 1000))
                .ForMember(dest => dest.EditedOn, options => options.MapFrom(src => src.EditedOn.HasValue ? src.EditedOn.Value.ToUnixTimeSeconds() * 1000 : (long?)null))
                .ForMember(dest => dest.DeletedOn, options => options.MapFrom(src => src.DeletedOn.HasValue ? src.DeletedOn.Value.ToUnixTimeSeconds() * 1000 : (long?)null));
                


        }
    }
}
