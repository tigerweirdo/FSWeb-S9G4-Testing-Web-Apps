import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import IletisimFormu from './IletisimFormu';

test('hata olmadan render ediliyor', () => {
  render(<IletisimFormu />);
});

test('iletişim formu headerı render ediliyor', () => {
  render(<IletisimFormu />);
  expect(screen.getByText('İletişim Formu')).toBeInTheDocument();
});

test('kullanıcı adını 5 karakterden az girdiğinde BİR hata mesajı render ediyor.', async () => {
    render(<IletisimFormu />);
    userEvent.type(screen.getByLabelText('Ad*'), 'İl');
    userEvent.click(screen.getByText('Gönder'));
  
    await waitFor(() => {
      const errors = screen.queryAllByTestId('error');
      const nameError = errors.find((error) => error.textContent.includes('ad en az 5 karakter olmalıdır.'));
      expect(nameError).toBeInTheDocument();
    });
  });
  
  

test('kullanıcı inputları doldurmadığında ÜÇ hata mesajı render ediliyor.', async () => {
  render(<IletisimFormu />);
  userEvent.click(screen.getByText('Gönder'));

  await waitFor(() => {
    expect(screen.getAllByTestId('error')).toHaveLength(3);
  });
});

test('kullanıcı doğru ad ve soyad girdiğinde ama email girmediğinde BİR hata mesajı render ediliyor.', async () => {
  render(<IletisimFormu />);
  userEvent.type(screen.getByPlaceholderText('İlhan'), 'İlhan');
  userEvent.type(screen.getByPlaceholderText('Mansız'), 'Mansız');
  userEvent.click(screen.getByText('Gönder'));

  await waitFor(() => {
    expect(screen.getAllByTestId('error')).toHaveLength(1);
  });
});

test('geçersiz bir mail girildiğinde "email geçerli bir email adresi olmalıdır." hata mesajı render ediliyor', async () => {
  render(<IletisimFormu />);
  userEvent.type(screen.getByPlaceholderText('yüzyılıngolcüsü@hotmail.com'), 'invalidemail');
  userEvent.click(screen.getByText('Gönder'));

  await waitFor(() => {
    expect(screen.getByText('Hata: email geçerli bir email adresi olmalıdır.')).toBeInTheDocument();
  });
});

test('soyad girilmeden gönderilirse "soyad gereklidir." mesajı render ediliyor', async () => {
  render(<IletisimFormu />);
  userEvent.type(screen.getByPlaceholderText('İlhan'), 'İlhan');
  userEvent.type(screen.getByPlaceholderText('yüzyılıngolcüsü@hotmail.com'), 'ilhan@hotmail.com');
  userEvent.click(screen.getByText('Gönder'));

  await waitFor(() => {
    expect(screen.getByText('Hata: soyad gereklidir.')).toBeInTheDocument();
  });
});

test('ad, soyad, email render ediliyor. mesaj bölümü doldurulmadığında hata mesajı render edilmiyor.', async () => {
    render(<IletisimFormu />);
    userEvent.type(screen.getByPlaceholderText('İlhan'), 'İlhan');
    userEvent.type(screen.getByPlaceholderText('Mansız'), 'Mansız');
    userEvent.type(screen.getByPlaceholderText('yüzyılıngolcüsü@hotmail.com'), 'ilhan@hotmail.com');
    userEvent.click(screen.getByText('Gönder'));
  
    await waitFor(() => {
      expect(screen.queryAllByTestId('error')).toHaveLength(0);
    });
  });
  
  test('form gönderildiğinde girilen tüm değerler render ediliyor.', async () => {
    render(<IletisimFormu />);
    userEvent.type(screen.getByPlaceholderText('İlhan'), 'İlhan');
    userEvent.type(screen.getByPlaceholderText('Mansız'), 'Mansız');
    userEvent.type(screen.getByPlaceholderText('yüzyılıngolcüsü@hotmail.com'), 'ilhan@hotmail.com');
    userEvent.type(screen.getByRole('textbox', {name: 'Mesaj'}), 'Merhaba, nasılsınız?');
    userEvent.click(screen.getByText('Gönder'));
  
    await waitFor(() => {
      expect(screen.getByTestId('firstnameDisplay')).toHaveTextContent('Ad: İlhan');
      expect(screen.getByTestId('lastnameDisplay')).toHaveTextContent('Soyad: Mansız');
      expect(screen.getByTestId('emailDisplay')).toHaveTextContent('Email: ilhan@hotmail.com');
      expect(screen.getByTestId('messageDisplay')).toHaveTextContent('Mesaj: Merhaba, nasılsınız?');
    });
  });
  