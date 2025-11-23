import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { createDono } from '@/services/api';

export default function CreateDonoScreen() {
  const router = useRouter();
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!nome || !cpf) {
      Alert.alert('Campos obrigatórios', 'Informe nome e CPF.');
      return;
    }
    setSubmitting(true);
    try {
      await createDono({ nome, cpf, telefone });
      Alert.alert('Sucesso', 'Dono cadastrado com sucesso!', [{ text: 'OK', onPress: () => router.back() }]);
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Não foi possível cadastrar o dono.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Novo Dono</Text>
      <Text style={styles.caption}>Registre um novo responsável para associar pets.</Text>

      <Field label="Nome" value={nome} onChangeText={setNome} placeholder="Fulano da Silva" />
      <Field label="CPF" value={cpf} onChangeText={setCpf} placeholder="000.000.000-00" keyboardType="numeric" />
      <Field label="Telefone" value={telefone} onChangeText={setTelefone} placeholder="(11) 99999-9999" keyboardType="phone-pad" />

      <Pressable onPress={handleSubmit} disabled={submitting} style={({ pressed }) => [styles.button, pressed && { opacity: 0.9 }, submitting && { opacity: 0.7 }]}>
        <Text style={styles.buttonText}>{submitting ? 'Salvando...' : 'Salvar'}</Text>
      </Pressable>
    </ScrollView>
  );
}

function Field({
  label,
  ...props
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput style={styles.input} placeholderTextColor="#94a3b8" {...props} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 16,
    backgroundColor: '#f5f7f2',
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0f172a',
  },
  caption: {
    color: '#475569',
    marginBottom: 12,
  },
  field: {
    gap: 6,
  },
  label: {
    color: '#475569',
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: '#cbd5f5',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#fff',
    fontSize: 16,
    color: '#0f172a',
  },
  button: {
    marginTop: 12,
    backgroundColor: '#8AC57B',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#0f172a',
    fontWeight: '700',
    fontSize: 16,
  },
});

