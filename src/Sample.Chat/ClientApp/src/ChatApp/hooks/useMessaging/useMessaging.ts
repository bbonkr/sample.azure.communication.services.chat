import { useSelector, useDispatch } from 'react-redux';
import { MessageModel } from '../../models';
import { rootAction } from '../../store/actions';
import { RootState } from '../../store/reducers';
import { MessagingState } from '../../store/reducers/messaging';

export const useMessaging = () => {
    const dispatch = useDispatch();
    const state = useSelector<RootState, MessagingState>((s) => s.messaging);

    return {
        ...state,
        addMessage: (payload: MessageModel) =>
            dispatch(rootAction.messaging.addMessage(payload)),
        removeMessage: (payload: string) =>
            dispatch(rootAction.messaging.removeMessage(payload)),
    };
};
