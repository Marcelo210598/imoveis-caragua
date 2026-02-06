"use client";
// Dark mode fix - feb 2026
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Home,
  MapPin,
  FileText,
  Camera,
  Check,
  Loader2,
} from "lucide-react";
import ImageUploader from "./ImageUploader";

const CITIES = ["Caraguatatuba", "Ubatuba", "Sao Sebastiao", "Ilhabela"];

const PROPERTY_TYPES = [
  { value: "apartamento", label: "Apartamento" },
  { value: "casa", label: "Casa" },
  { value: "terreno", label: "Terreno" },
  { value: "comercial", label: "Comercial" },
  { value: "rural", label: "Rural" },
  { value: "outro", label: "Outro" },
];

interface FormData {
  type: string;
  propertyType: string;
  city: string;
  neighborhood: string;
  title: string;
  description: string;
  price: string;
  area: string;
  bedrooms: string;
  bathrooms: string;
  parkingSpaces: string;
  address: string;
  photoUrls: string[];
}

const INITIAL_FORM: FormData = {
  type: "",
  propertyType: "",
  city: "",
  neighborhood: "",
  title: "",
  description: "",
  price: "",
  area: "",
  bedrooms: "",
  bathrooms: "",
  parkingSpaces: "",
  address: "",
  photoUrls: [],
};

const STEPS = [
  { icon: Home, label: "Tipo" },
  { icon: FileText, label: "Detalhes" },
  { icon: Camera, label: "Fotos" },
  { icon: Check, label: "Revisar" },
];

export default function PropertyForm() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  function updateForm(partial: Partial<FormData>) {
    setForm((prev) => ({ ...prev, ...partial }));
    // Limpar erros dos campos alterados
    const keys = Object.keys(partial);
    setErrors((prev) => {
      const next = { ...prev };
      keys.forEach((k) => delete next[k]);
      return next;
    });
  }

  function validateStep(s: number): boolean {
    const errs: Record<string, string> = {};

    if (s === 0) {
      if (!form.type) errs.type = "Selecione venda ou aluguel";
      if (!form.propertyType) errs.propertyType = "Selecione o tipo de imovel";
      if (!form.city) errs.city = "Selecione a cidade";
    }

    if (s === 1) {
      if (!form.title || form.title.length < 5)
        errs.title = "Titulo deve ter no minimo 5 caracteres";
      if (!form.price || Number(form.price) <= 0)
        errs.price = "Informe o preco";
    }

    if (s === 2) {
      if (form.photoUrls.length === 0)
        errs.photoUrls = "Adicione pelo menos 1 foto";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function nextStep() {
    if (validateStep(step)) {
      setStep((s) => Math.min(s + 1, STEPS.length - 1));
    }
  }

  function prevStep() {
    setStep((s) => Math.max(s - 1, 0));
  }

  async function handleSubmit() {
    if (!validateStep(2)) {
      setStep(2);
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      const payload = {
        type: form.type,
        propertyType: form.propertyType,
        city: form.city,
        neighborhood: form.neighborhood || undefined,
        title: form.title,
        description: form.description || undefined,
        price: Number(form.price),
        area: form.area ? Number(form.area) : undefined,
        bedrooms: form.bedrooms ? Number(form.bedrooms) : undefined,
        bathrooms: form.bathrooms ? Number(form.bathrooms) : undefined,
        parkingSpaces: form.parkingSpaces
          ? Number(form.parkingSpaces)
          : undefined,
        address: form.address || undefined,
        photoUrls: form.photoUrls,
      };

      const res = await fetch("/api/properties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erro ao criar imovel");
      }

      router.push(`/imoveis/${data.property.id}`);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Erro ao criar imovel",
      );
    } finally {
      setSubmitting(false);
    }
  }

  function formatPriceInput(value: string): string {
    const num = value.replace(/\D/g, "");
    if (!num) return "";
    return Number(num).toLocaleString("pt-BR");
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress steps */}
      <div className="flex items-center justify-between mb-8">
        {STEPS.map((s, i) => {
          const Icon = s.icon;
          const active = i === step;
          const done = i < step;
          return (
            <div key={i} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                    done
                      ? "bg-primary-600 text-white"
                      : active
                        ? "bg-primary-100 text-primary-600 ring-2 ring-primary-600"
                        : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {done ? <Check size={18} /> : <Icon size={18} />}
                </div>
                <span
                  className={`text-xs mt-1 ${
                    active ? "text-primary-600 font-medium" : "text-gray-400"
                  }`}
                >
                  {s.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className={`w-12 sm:w-20 h-0.5 mx-1 ${
                    i < step ? "bg-primary-600" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Step 0: Tipo e Localizacao */}
      {step === 0 && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Tipo e localizacao
          </h2>

          {/* Venda / Aluguel */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Modalidade *
            </label>
            <div className="grid grid-cols-2 gap-3">
              {["venda", "aluguel"].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => updateForm({ type: t })}
                  className={`py-3 px-4 rounded-xl border-2 text-sm font-medium transition-colors capitalize ${
                    form.type === t
                      ? "border-primary-600 bg-primary-50 text-primary-700 dark:bg-primary-900 dark:text-primary-300"
                      : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-600 dark:text-gray-300"
                  }`}
                >
                  {t === "venda" ? "Venda" : "Aluguel"}
                </button>
              ))}
            </div>
            {errors.type && (
              <p className="text-red-500 text-sm mt-1">{errors.type}</p>
            )}
          </div>

          {/* Tipo de imovel */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tipo de imovel *
            </label>
            <div className="grid grid-cols-3 gap-3">
              {PROPERTY_TYPES.map((pt) => (
                <button
                  key={pt.value}
                  type="button"
                  onClick={() => updateForm({ propertyType: pt.value })}
                  className={`py-3 px-3 rounded-xl border-2 text-sm font-medium transition-colors ${
                    form.propertyType === pt.value
                      ? "border-primary-600 bg-primary-50 text-primary-700 dark:bg-primary-900 dark:text-primary-300"
                      : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-600 dark:text-gray-300"
                  }`}
                >
                  {pt.label}
                </button>
              ))}
            </div>
            {errors.propertyType && (
              <p className="text-red-500 text-sm mt-1">{errors.propertyType}</p>
            )}
          </div>

          {/* Cidade */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Cidade *
            </label>
            <div className="grid grid-cols-2 gap-3">
              {CITIES.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => updateForm({ city: c })}
                  className={`py-3 px-4 rounded-xl border-2 text-sm font-medium transition-colors ${
                    form.city === c
                      ? "border-primary-600 bg-primary-50 text-primary-700 dark:bg-primary-900 dark:text-primary-300"
                      : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-600 dark:text-gray-300"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
            {errors.city && (
              <p className="text-red-500 text-sm mt-1">{errors.city}</p>
            )}
          </div>

          {/* Bairro */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Bairro
            </label>
            <input
              type="text"
              value={form.neighborhood}
              onChange={(e) => updateForm({ neighborhood: e.target.value })}
              placeholder="Ex: Martim de Sa, Praia Grande..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
            />
          </div>
        </div>
      )}

      {/* Step 1: Detalhes */}
      {step === 1 && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Detalhes do imovel
          </h2>

          {/* Titulo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Titulo do anuncio *
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => updateForm({ title: e.target.value })}
              placeholder="Ex: Casa 3 quartos com piscina na praia"
              maxLength={120}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
            />
            <p className="text-xs text-gray-400 mt-1">
              {form.title.length}/120
            </p>
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title}</p>
            )}
          </div>

          {/* Descricao */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Descricao
            </label>
            <textarea
              value={form.description}
              onChange={(e) => updateForm({ description: e.target.value })}
              placeholder="Descreva o imovel, diferenciais, pontos de referencia..."
              maxLength={2000}
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm resize-none"
            />
            <p className="text-xs text-gray-400 mt-1">
              {form.description.length}/2000
            </p>
          </div>

          {/* Preco */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Preco (R$) *
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={form.price ? formatPriceInput(form.price) : ""}
              onChange={(e) => {
                const raw = e.target.value.replace(/\D/g, "");
                updateForm({ price: raw });
              }}
              placeholder="500.000"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
            />
            {errors.price && (
              <p className="text-red-500 text-sm mt-1">{errors.price}</p>
            )}
          </div>

          {/* Area */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Area (m2)
            </label>
            <input
              type="number"
              value={form.area}
              onChange={(e) => updateForm({ area: e.target.value })}
              placeholder="120"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
            />
          </div>

          {/* Quartos, Banheiros, Vagas */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Quartos
              </label>
              <input
                type="number"
                min="0"
                max="20"
                value={form.bedrooms}
                onChange={(e) => updateForm({ bedrooms: e.target.value })}
                placeholder="0"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Banheiros
              </label>
              <input
                type="number"
                min="0"
                max="20"
                value={form.bathrooms}
                onChange={(e) => updateForm({ bathrooms: e.target.value })}
                placeholder="0"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Vagas
              </label>
              <input
                type="number"
                min="0"
                max="20"
                value={form.parkingSpaces}
                onChange={(e) => updateForm({ parkingSpaces: e.target.value })}
                placeholder="0"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
              />
            </div>
          </div>

          {/* Endereco */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Endereco
            </label>
            <input
              type="text"
              value={form.address}
              onChange={(e) => updateForm({ address: e.target.value })}
              placeholder="Rua, numero (opcional)"
              maxLength={200}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
            />
          </div>
        </div>
      )}

      {/* Step 2: Fotos */}
      {step === 2 && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-900">Fotos do imovel</h2>
          <p className="text-gray-500 text-sm">
            Boas fotos fazem toda a diferenca. Adicione ate 10 fotos do imovel.
          </p>
          <ImageUploader
            images={form.photoUrls}
            onChange={(photoUrls) => updateForm({ photoUrls })}
          />
          {errors.photoUrls && (
            <p className="text-red-500 text-sm">{errors.photoUrls}</p>
          )}
        </div>
      )}

      {/* Step 3: Revisao */}
      {step === 3 && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-900">
            Revisar e publicar
          </h2>

          <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
            {/* Preview da foto */}
            {form.photoUrls.length > 0 && (
              <div className="aspect-video overflow-hidden rounded-t-xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={form.photoUrls[0]}
                  alt="Capa"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="p-5 space-y-3">
              <div className="flex items-center gap-2">
                <span className="bg-primary-100 text-primary-700 text-xs px-2 py-0.5 rounded-full capitalize">
                  {form.type}
                </span>
                <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full capitalize">
                  {form.propertyType}
                </span>
              </div>

              <h3 className="text-lg font-bold text-gray-900">{form.title}</h3>

              <p className="text-2xl font-bold text-gray-900">
                R$ {formatPriceInput(form.price)}
              </p>

              <div className="flex items-center gap-1 text-sm text-primary-600">
                <MapPin size={14} />
                {form.neighborhood
                  ? `${form.neighborhood}, ${form.city}`
                  : form.city}
              </div>

              {form.description && (
                <p className="text-sm text-gray-500">{form.description}</p>
              )}

              <div className="flex gap-4 text-sm text-gray-500">
                {form.bedrooms && <span>{form.bedrooms} quartos</span>}
                {form.bathrooms && <span>{form.bathrooms} banheiros</span>}
                {form.parkingSpaces && <span>{form.parkingSpaces} vagas</span>}
                {form.area && <span>{form.area} m2</span>}
              </div>

              <p className="text-xs text-gray-400">
                {form.photoUrls.length} foto
                {form.photoUrls.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          {submitError && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm">
              {submitError}
            </div>
          )}
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
        {step > 0 ? (
          <button
            type="button"
            onClick={prevStep}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ChevronLeft size={18} />
            Voltar
          </button>
        ) : (
          <div />
        )}

        {step < STEPS.length - 1 ? (
          <button
            type="button"
            onClick={nextStep}
            className="flex items-center gap-2 px-6 py-2.5 bg-primary-600 text-white text-sm font-medium rounded-xl hover:bg-primary-700 transition-colors"
          >
            Proximo
            <ChevronRight size={18} />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="flex items-center gap-2 px-6 py-2.5 bg-primary-600 text-white text-sm font-medium rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-50"
          >
            {submitting ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Publicando...
              </>
            ) : (
              <>
                <Check size={18} />
                Publicar imovel
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
