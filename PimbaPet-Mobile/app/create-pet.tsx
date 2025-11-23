import { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Dono, createPet, getDonos } from '@/services/api';

export default function CreatePetScreen() {
  const router = useRouter();
  const [nome, setNome] = useState('');
  const [tipo, setTipo] = useState('');
  const [raca, setRaca] = useState('');
  const [donoId, setDonoId] = useState<number | null>(null);
  const [donos, setDonos] = useState<Dono[]>([]);
  const [loadingDonos, setLoadingDonos] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadDonos = async () => {
      try {
        const data = await getDonos();
        setDonos(data);
      } catch {
        Alert.alert('Erro', 'Não foi possível carregar os donos.');
      } finally {
        setLoadingDonos(false);
      }
    };
    loadDonos();
  }, []);

  const handleSubmit = async () => {
    if (!nome || !tipo || !raca || !donoId) {
      Alert.alert('Campos obrigatórios', 'Preencha todas as informações e selecione um dono.');
      return;
    }
    setSubmitting(true);
    try {
      await createPet({ nome, tipo, raca, donoId });
      Alert.alert('Sucesso', 'Pet cadastrado com sucesso!', [{ text: 'OK', onPress: () => router.back() }]);
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Não foi possível cadastrar o pet.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Novo Pet</Text>
      <Text style={styles.caption}>Preencha os dados e associe o pet a um dono existente.</Text>

      <Field label="Nome" value={nome} onChangeText={setNome} placeholder="Pimba" />
      <Field label="Tipo" value={tipo} onChangeText={setTipo} placeholder="Cachorro" />
      <Field label="Raça" value={raca} onChangeText={setRaca} placeholder="Poodle" />

      <View style={styles.field}>
        <Text style={styles.label}>Selecione o dono</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.donoList}>
          {loadingDonos ? (
            <Text style={styles.loadingDonos}>Carregando donos...</Text>
          ) : donos.length === 0 ? (
            <Text style={styles.loadingDonos}>Cadastre um dono primeiro.</Text>
          ) : (
            donos.map((dono) => {
              const selected = donoId === Number(dono.id);
              return (
                <Pressable
                  key={dono.id}
                  onPress={() => setDonoId(Number(dono.id))}
                  style={[styles.donoChip, selected && styles.donoChipSelected]}>
                  <Text style={[styles.donoChipText, selected && styles.donoChipTextSelected]}>{dono.nome}</Text>
                </Pressable>
              );
            })
          )}
        </ScrollView>
      </View>

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
  donoList: {
    gap: 10,
    paddingVertical: 4,
  },
  donoChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: '#e2e8f0',
  },
  donoChipSelected: {
    backgroundColor: '#8AC57B',
  },
  donoChipText: {
    color: '#0f172a',
    fontWeight: '600',
  },
  donoChipTextSelected: {
    color: '#0f172a',
  },
  loadingDonos: {
    color: '#94a3b8',
    paddingVertical: 8,
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

