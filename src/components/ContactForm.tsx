import { useEffect, useRef, useState } from 'react';
import IMask from 'imask';

interface Props {
  defaultTechnics?: string;
  compact?: boolean;
  variant?: 'request' | 'feedback';
  title?: string;
}

export default function ContactForm({
  defaultTechnics = '',
  compact = false,
  variant = 'request',
  title,
}: Props) {
  const phoneRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

  useEffect(() => {
    if (!phoneRef.current) return;
    const mask = IMask(phoneRef.current, { mask: '+7(000)000-00-00' });
    return () => mask.destroy();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const phone = phoneRef.current?.value.replace(/[(),\-_]/g, '') ?? '';

    if (!phone) {
      setError('Поле обязательно для заполнения!');
      phoneRef.current?.classList.add('error');
      return;
    }
    if (phone.replace(/\D/g, '').length < 11) {
      setError('Некорректно введен номер телефона');
      phoneRef.current?.classList.add('error');
      return;
    }

    setError('');
    phoneRef.current?.classList.remove('error');

    if (!formRef.current) return;
    const formData = new FormData(formRef.current);

    setStatus('sending');
    try {
      const res = await fetch('/mail.php', { method: 'POST', body: formData });
      if (!res.ok) throw new Error('Server error');
      setStatus('sent');
      formRef.current.reset();
    } catch {
      setError('Ошибка отправки. Попробуйте позже.');
      setStatus('idle');
    }
  }

  const technicOptions = [
    'Автокран',
    'Манипулятор',
    'Мини-погрузчик',
    'Мини-экскаватор',
    'Самосвал',
    'Телескопический погрузчик',
    'Фронтальный погрузчик',
    'Экскаватор гусеничный',
    'Экскаватор колесный',
    'Экскаватор погрузчик',
  ];

  const colClass = compact ? 'col-sm-12' : 'col-sm-6';

  return (
    <form
      id="requestform"
      className="request__form col-12"
      name="request_form"
      ref={formRef}
      onSubmit={handleSubmit}
    >
      {title && (
        <fieldset>
          <h2 className="legend">{title}</h2>
        </fieldset>
      )}
      <div className="form-row text-center">
        <div className={`${colClass} user user__name`}>
          <label htmlFor="name" className="form-label">Ваше имя</label>
          <input
            id="name"
            className="form-control"
            type="text"
            name="user_name"
            placeholder="Иван Иванов"
          />
        </div>
        <div className={`${colClass} user user__phone`}>
          <label htmlFor="phone" className="form-label">
            Телефон <span className="required-mark">*</span>
          </label>
          <input
            id="phone"
            className="form-control"
            type="tel"
            name="user_phone"
            placeholder="+7(999)999-99-99"
            defaultValue="+7"
            maxLength={16}
            ref={phoneRef}
          />
        </div>

        {variant === 'request' ? (
          <>
            <div className={`${colClass} user user__technics`}>
              <label htmlFor="technics" className="form-label">Тип техники</label>
              <input
                id="technics"
                className="form-control"
                type="text"
                list="technic-options"
                name="user_technics"
                defaultValue={defaultTechnics}
                placeholder="Например: Автокран"
              />
              <datalist id="technic-options">
                {technicOptions.map((opt) => (
                  <option key={opt} value={opt} />
                ))}
              </datalist>
            </div>
            <div className={`${colClass} user user__rent`}>
              <label htmlFor="rent" className="form-label">Срок аренды</label>
              <input
                id="rent"
                className="form-control"
                type="text"
                name="user_rent"
                placeholder="Количество смен (1 смена = 8 часов)"
              />
            </div>
          </>
        ) : (
          <>
            <div className={`${colClass} user`}>
              <label htmlFor="mail" className="form-label">Email</label>
              <input
                id="mail"
                className="form-control"
                type="email"
                name="user_mail"
                placeholder="example@mail.ru"
              />
            </div>
            <div className="col-sm-12 user">
              <label htmlFor="text" className="form-label">Текст сообщения</label>
              <textarea
                id="text"
                className="form-control"
                name="user_rent"
                placeholder="Опишите вашу задачу"
                rows={6}
              />
            </div>
          </>
        )}

        <p className={compact ? 'warning' : 'warning col-12'}>
          Нажимая кнопку «Отправить», я даю своё согласие на обработку персональных данных в
          соответствии с законом ФЗ-152 О персональных данных.
        </p>

        {error && (
          <div id="error" className="error col">
            {error}
          </div>
        )}

        <button
          id="sendMail"
          className={compact ? 'btn btn_modal text-left' : 'btn col-lg-2 col-sm-4'}
          type="submit"
          disabled={status === 'sending'}
          data-sent={status === 'sent' || undefined}
        >
          {status === 'sent' ? 'Отправлено' : status === 'sending' ? 'Отправка...' : 'Отправить'}
        </button>
      </div>
    </form>
  );
}
