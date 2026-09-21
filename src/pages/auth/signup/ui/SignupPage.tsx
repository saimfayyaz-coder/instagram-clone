import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AppText, Button } from '@/shared/components/atoms';
import { AuthScreenWrapper } from '@/shared/components/organisms';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '@/shared/types';
import { useTranslation } from 'react-i18next';

type Props = NativeStackScreenProps<AuthStackParamList, 'Signup'>;

export const SignupPage: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();

  return (
    <AuthScreenWrapper>
      <View style={styles.container}>
        <AppText variant="heading" align="center" style={styles.title}>
          Sign Up Page
        </AppText>
        <AppText variant="body" align="center" style={styles.subtitle}>
          Sign up feature will be implemented next.
        </AppText>
        <Button
          title="Back to Login"
          variant="primary"
          onPress={() => navigation.navigate('Login')}
          style={styles.button}
        />
      </View>
    </AuthScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    marginBottom: 12,
  },
  subtitle: {
    marginBottom: 24,
  },
  button: {
    width: '100%',
  },
});
