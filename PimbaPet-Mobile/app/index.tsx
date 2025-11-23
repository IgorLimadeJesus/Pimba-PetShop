import { useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { setAuthToken, login } from '@/services/api';
import { loadToken, saveToken } from '@/services/auth-storage';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const restoreSession = async () => {
      const storedToken = await loadToken();
      if (storedToken) {
        setAuthToken(storedToken);
        router.replace('/dashboard');
      }
    };
    restoreSession();
  }, [router]);

  const handleLogin = async () => {
    if (!email || !senha) {
      Alert.alert('Campos obrigatórios', 'Informe email e senha para continuar.');
      return;
    }
    console.log('handleLogin called', { email, senha });
    setLoading(true);
    try {
      const result = await login({ email, senha });
      await saveToken(result.token);
      setAuthToken(result.token);
      router.replace('/dashboard');
    } catch (error: any) {
      Alert.alert('Erro ao entrar', error.message || 'Verifique suas credenciais e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.gradient}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.card}>
          <Text style={styles.heading}>PimbaPet</Text>
          <Text style={styles.subtitle}>Faça login para acompanhar seus clientes e pets</Text>

          <View style={styles.field}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              autoCapitalize="none"
              keyboardType="email-address"
              placeholder="admin@pimbapet.com"
              placeholderTextColor="#94a3b8"
              style={styles.input}
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Senha</Text>
            <TextInput
              placeholder="********"
              placeholderTextColor="#94a3b8"
              secureTextEntry
              style={styles.input}
              value={senha}
              onChangeText={setSenha}
            />
          </View>

          <Pressable disabled={loading} onPress={handleLogin} style={({ pressed }) => [styles.button, pressed && { opacity: 0.8 }, loading && { opacity: 0.6 }]}>
            <Text style={styles.buttonText}>{loading ? 'Entrando...' : 'Entrar'}</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    borderRadius: 18,
    padding: 24,
    gap: 16,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
  heading: {
    fontSize: 32,
    fontWeight: '700',
    color: '#8AC57B',
  },
  subtitle: {
    color: '#e2e8f0',
    fontSize: 15,
    marginBottom: 8,
  },
  field: {
    gap: 6,
  },
  label: {
    color: '#e2e8f0',
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#f8fafc',
    fontSize: 16,
    backgroundColor: '#0f172a',
  },
  button: {
    marginTop: 12,
    backgroundColor: '#8AC57B',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#0f172a',
    fontWeight: '700',
    fontSize: 16,
  },
});

