import type { ReactNode } from 'react';
import { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { Dono, Pet, getDonos, getPets, setAuthToken } from '@/services/api';
import { clearToken } from '@/services/auth-storage';

const accent = '#8AC57B';

export default function DashboardScreen() {
  const router = useRouter();
  const [donos, setDonos] = useState<Dono[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setError(null);
    try {
      const [donosData, petsData] = await Promise.all([getDonos(), getPets()]);
      setDonos(donosData);
      setPets(petsData);
    } catch (err: any) {
      setError(err.message || 'Não foi possível carregar os dados.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const handleRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const handleLogout = async () => {
    await clearToken();
    setAuthToken(null);
    router.replace('/');
  };

  const totalStats = useMemo(
    () => [
      { label: 'Donos', value: donos.length },
      { label: 'Pets', value: pets.length },
    ],
    [donos.length, pets.length]
  );

  const linkedPets = useMemo(
    () =>
      pets.map((pet) => ({
        ...pet,
        donoNome: donos.find((dono) => dono.id === pet.donoId)?.nome ?? 'N/A',
      })),
    [pets, donos]
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={accent} />
        <Text style={styles.loadingText}>Carregando informações...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={[accent]} />}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Dashboard</Text>
          <Text style={styles.caption}>Acompanhe donos e pets em tempo real</Text>
        </View>
        <Pressable onPress={handleLogout} style={({ pressed }) => [styles.logoutButton, pressed && { opacity: 0.8 }]}>
          <Text style={styles.logoutText}>Sair</Text>
        </Pressable>
      </View>

      {error && (
        <Pressable onPress={loadData} style={styles.errorCard}>
          <Text style={styles.errorText}>{error}</Text>
          <Text style={styles.errorAction}>Toque para tentar novamente</Text>
        </Pressable>
      )}

      <View style={styles.statsRow}>
        {totalStats.map((stat) => (
          <View key={stat.label} style={styles.statCard}>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      <Section
        title="Últimos Pets"
        count={pets.length}
        onAdd={() => router.push('/create-pet')}>
        {linkedPets.length === 0 ? (
          <EmptyState message="Nenhum pet cadastrado ainda." actionLabel="Adicionar pet" onAction={() => router.push('/create-pet')} />
        ) : (
          linkedPets.slice(0, 5).map((pet) => (
            <View key={pet.id || `${pet.nome}-${pet.donoId}`} style={styles.listItem}>
              <View>
                <Text style={styles.itemTitle}>{pet.nome}</Text>
                <Text style={styles.itemSubtitle}>
                  {pet.tipo} • {pet.raca}
                </Text>
              </View>
              <Text style={styles.badge}>{pet.donoNome}</Text>
            </View>
          ))
        )}
      </Section>

      <Section
        title="Donos"
        count={donos.length}
        onAdd={() => router.push('/create-dono')}>
        {donos.length === 0 ? (
          <EmptyState message="Comece registrando um dono." actionLabel="Cadastrar dono" onAction={() => router.push('/create-dono')} />
        ) : (
          donos.slice(0, 5).map((dono) => (
            <View key={dono.id} style={styles.listItem}>
              <View>
                <Text style={styles.itemTitle}>{dono.nome}</Text>
                <Text style={styles.itemSubtitle}>{dono.telefone || 'Sem telefone'}</Text>
              </View>
              <Text style={styles.badgeMuted}>{dono.cpf}</Text>
            </View>
          ))
        )}
      </Section>
    </ScrollView>
  );
}

function Section({
  title,
  count,
  children,
  onAdd,
}: {
  title: string;
  count: number;
  children: ReactNode;
  onAdd: () => void;
}) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.sectionTitle}>{title}</Text>
          <Text style={styles.sectionCaption}>{count} no total</Text>
        </View>
        <Pressable onPress={onAdd} style={({ pressed }) => [styles.addButton, pressed && { opacity: 0.85 }]}>
          <Text style={styles.addButtonText}>Adicionar</Text>
        </Pressable>
      </View>
      <View style={styles.sectionCard}>{children}</View>
    </View>
  );
}

function EmptyState({
  message,
  actionLabel,
  onAction,
}: {
  message: string;
  actionLabel: string;
  onAction: () => void;
}) {
  return (
    <View style={styles.empty}>
      <Text style={styles.emptyText}>{message}</Text>
      <Pressable onPress={onAction}>
        <Text style={styles.emptyAction}>{actionLabel}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7f2',
  },
  content: {
    padding: 20,
    paddingBottom: 32,
    gap: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  greeting: {
    fontSize: 26,
    fontWeight: '700',
    color: '#0f172a',
  },
  caption: {
    color: '#475569',
    marginTop: 4,
  },
  logoutButton: {
    borderWidth: 1,
    borderColor: '#cbd5f5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  logoutText: {
    color: '#0f172a',
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#0f172a',
    borderRadius: 16,
    padding: 16,
  },
  statValue: {
    color: '#f8fafc',
    fontSize: 28,
    fontWeight: '700',
  },
  statLabel: {
    color: '#94a3b8',
    marginTop: 4,
    fontSize: 14,
  },
  section: {
    gap: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#0f172a',
  },
  sectionCaption: {
    color: '#64748b',
  },
  addButton: {
    backgroundColor: accent,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
  },
  addButtonText: {
    color: '#0f172a',
    fontWeight: '700',
  },
  sectionCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 4,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e2e8f0',
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
  },
  itemSubtitle: {
    color: '#475569',
    marginTop: 2,
  },
  badge: {
    backgroundColor: '#ecfccb',
    color: '#3f6212',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    fontSize: 12,
    fontWeight: '600',
  },
  badgeMuted: {
    backgroundColor: '#e2e8f0',
    color: '#0f172a',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    fontSize: 12,
    fontWeight: '600',
  },
  empty: {
    alignItems: 'center',
    padding: 24,
    gap: 8,
  },
  emptyText: {
    color: '#475569',
    textAlign: 'center',
  },
  emptyAction: {
    color: accent,
    fontWeight: '700',
  },
  errorCard: {
    backgroundColor: '#fee2e2',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  errorText: {
    color: '#991b1b',
    fontWeight: '600',
  },
  errorAction: {
    color: '#991b1b',
    marginTop: 4,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f7f2',
    gap: 12,
  },
  loadingText: {
    color: '#475569',
  },
});

