import { NativeStackNavigationProp } from '@react-navigation/native-stack';
type RootStackParamList = {
    Onboarding: undefined;
    Home: undefined;
    Profile: undefined;
    Dashboard: undefined;
    Login: undefined;
    EditProfile: undefined;
    Feedback:undefined;
    MainApp:undefined;
    AddFeedback:{editId:any,editFeedback:any} | undefined,
    AddTrip:undefined;
    ForgotPassword: undefined;
    ExpenseChart: undefined;
};

export type NavigationProp = NativeStackNavigationProp<RootStackParamList>;