import React, { useState, useMemo, useEffect } from 'react';
import { Plan, User, PlanDetails, Language } from '../types';
import { translations } from '../i18n';
import { useAppContext } from '../AppContext';
import { EditIcon } from '../components/icons/EditIcon';
import { DeleteIcon } from '../components/icons/DeleteIcon';

interface AdminDashboardSectionProps {}

const StatCard: React.FC<{ title: string; value: number | string }> = ({ title, value }) => (
    <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-glass-border">
        <h3 className="text-text-muted text-sm font-semibold uppercase tracking-wider">{title}</h3>
        <p className="text-3xl font-bold text-text-light mt-1">{value}</p>
    </div>
);

const UserFormModal: React.FC<{ userToEdit?: User | null; onClose: () => void; t: any }> = ({ userToEdit, onClose, t }) => {
    const { addUser, updateUser, plans } = useAppContext();
    const [name, setName] = useState(userToEdit?.name || '');
    const [email, setEmail] = useState(userToEdit?.email || '');
    const [password, setPassword] = useState('');
    const [plan, setPlan] = useState<Plan>(userToEdit?.plan || Plan.FREE);
    
    const isEditing = !!userToEdit;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEditing) {
            updateUser({ ...userToEdit, name, email, plan });
        } else {
            addUser({ name, email, password, plan });
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-night-end rounded-2xl shadow-2xl p-8 w-full max-w-md m-4 border border-glass-border">
                <h2 className="text-2xl font-bold text-text-light mb-6">{isEditing ? t.admin.form.editUserTitle : t.admin.form.addUserTitle}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-text-muted">{t.admin.form.name}</label>
                        <input type="text" value={name} onChange={e => setName(e.target.value)} required className="mt-1 block w-full p-2 bg-white/5 border border-glass-border rounded-lg text-text-light" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-text-muted">{t.admin.form.email}</label>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="mt-1 block w-full p-2 bg-white/5 border border-glass-border rounded-lg text-text-light" />
                    </div>
                    {!isEditing && (
                         <div>
                            <label className="block text-sm font-medium text-text-muted">{t.admin.form.password}</label>
                            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="mt-1 block w-full p-2 bg-white/5 border border-glass-border rounded-lg text-text-light" />
                        </div>
                    )}
                     <div>
                        <label className="block text-sm font-medium text-text-muted">{t.admin.form.plan}</label>
                        <select value={plan} onChange={e => setPlan(e.target.value as Plan)} required className="mt-1 block w-full p-2 bg-white/5 border border-glass-border rounded-lg text-text-light">
                            {plans.map(p => <option key={p.id} value={p.id}>{p.name.en}</option>)}
                        </select>
                    </div>
                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onClose} className="bg-white/10 text-text-light font-semibold py-2 px-6 rounded-lg">{t.admin.form.cancel}</button>
                        <button type="submit" className="bg-gradient-to-r from-accent-start to-accent-end text-night-start font-semibold py-2 px-6 rounded-lg">{t.admin.form.save}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const BrandingManager: React.FC<{t: any}> = ({t}) => {
    const { updateLogos, logoUrl, whiteLogoUrl } = useAppContext();
    const [colorLogo, setColorLogo] = useState<string | null>(null);
    const [whiteLogo, setWhiteLogo] = useState<string | null>(null);
    const [message, setMessage] = useState('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setter: (val: string) => void) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setter(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleSave = () => {
        updateLogos({
            colorLogo: colorLogo || logoUrl,
            whiteLogo: whiteLogo || whiteLogoUrl,
        });
        setMessage(t.admin.branding.success);
        setTimeout(() => setMessage(''), 3000);
    };

    return (
         <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-glass-border">
            <h2 className="text-xl font-bold text-text-light mb-4">{t.admin.branding.title}</h2>
            <p className="text-text-muted mb-4 text-sm">{t.admin.branding.helper}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="text-center">
                    <label className="block text-sm font-medium text-text-muted mb-2">{t.admin.branding.logoColor}</label>
                    <img src={colorLogo || logoUrl} alt="Color Logo Preview" className="h-16 mx-auto mb-2 bg-gray-200 rounded p-1"/>
                    <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, setColorLogo)} className="text-sm text-text-muted file:mr-4 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-white/10 file:text-text-light"/>
                </div>
                <div className="text-center">
                    <label className="block text-sm font-medium text-text-muted mb-2">{t.admin.branding.logoWhite}</label>
                    <img src={whiteLogo || whiteLogoUrl} alt="White Logo Preview" className="h-16 mx-auto mb-2 bg-night-start rounded p-1"/>
                     <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, setWhiteLogo)} className="text-sm text-text-muted file:mr-4 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-white/10 file:text-text-light"/>
                </div>
            </div>
            <div className="mt-4 text-center">
                <button onClick={handleSave} className="bg-gradient-to-r from-accent-start to-accent-end text-night-start font-semibold py-2 px-6 rounded-lg">{t.admin.branding.save}</button>
                {message && <p className="text-green-400 text-sm mt-2">{message}</p>}
            </div>
         </div>
    );
};

const SubscriptionLinkManager: React.FC<{t: any}> = ({t}) => {
    const { subscriptionUrl, updateSubscriptionUrl } = useAppContext();
    const [url, setUrl] = useState(subscriptionUrl);
    const [message, setMessage] = useState('');

    const handleSave = () => {
        updateSubscriptionUrl(url);
        setMessage(t.admin.subscriptionLink.success);
        setTimeout(() => setMessage(''), 3000);
    };

    return (
        <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-glass-border">
            <h2 className="text-xl font-bold text-text-light mb-4">{t.admin.subscriptionLink.title}</h2>
            <p className="text-text-muted mb-4 text-sm">{t.admin.subscriptionLink.helper}</p>
            <div className="flex flex-col sm:flex-row gap-4">
                <input 
                    type="url" 
                    value={url} 
                    onChange={e => setUrl(e.target.value)} 
                    placeholder="https://your-payment-provider.com/subscribe"
                    className="flex-grow p-2 bg-white/5 border border-glass-border rounded-lg text-text-light"
                />
                <button onClick={handleSave} className="bg-gradient-to-r from-accent-start to-accent-end text-night-start font-semibold py-2 px-6 rounded-lg">{t.admin.subscriptionLink.save}</button>
            </div>
             {message && <p className="text-green-400 text-sm mt-2">{message}</p>}
        </div>
    );
};

const PlanManager: React.FC<{t: any}> = ({t}) => {
    const { plans, updatePlans } = useAppContext();
    const [editablePlans, setEditablePlans] = useState<PlanDetails[]>(JSON.parse(JSON.stringify(plans))); // Deep copy
    const [message, setMessage] = useState('');

    const handlePlanChange = <K extends keyof PlanDetails, V extends PlanDetails[K]>(planId: Plan, key: K, value: V) => {
        setEditablePlans(prev => prev.map(p => p.id === planId ? { ...p, [key]: value } : p));
    };
    
    const handleMultilangChange = (planId: Plan, lang: Language, key: 'name' | 'features', value: string) => {
       setEditablePlans(prev => prev.map(p => {
           if (p.id === planId) {
               const currentVal = p[key];
               if (typeof currentVal === 'object' && 'en' in currentVal) {
                   if (key === 'features') {
                       return {...p, features: {...currentVal, [lang]: value.split('\n') } };
                   }
                   return {...p, name: {...currentVal, [lang]: value}};
               }
           }
           return p;
       }));
    };

    const handleSave = () => {
        updatePlans(editablePlans);
        setMessage(t.admin.plans.success);
        setTimeout(() => setMessage(''), 3000);
    };

    return (
        <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-glass-border">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-text-light">{t.admin.plans.title}</h2>
                    <p className="text-text-muted mb-4 text-sm">{t.admin.plans.helper}</p>
                </div>
                 <button onClick={handleSave} className="bg-gradient-to-r from-accent-start to-accent-end text-night-start font-semibold py-2 px-6 rounded-lg self-start">{t.admin.plans.save}</button>
            </div>
            {message && <p className="text-green-400 text-sm mb-4">{message}</p>}
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
                {editablePlans.map(plan => (
                    <div key={plan.id} className="bg-white/5 p-4 rounded-xl border border-glass-border space-y-4">
                        <h3 className="text-lg font-bold text-accent-end text-center">{plan.name.en} / {plan.name.ar}</h3>
                        <div>
                            <label className="block text-sm font-medium text-text-muted">{t.admin.plans.planName} (EN)</label>
                            <input type="text" value={plan.name.en} onChange={e => handleMultilangChange(plan.id, Language.EN, 'name', e.target.value)} className="w-full p-2 bg-white/10 border border-glass-border rounded-lg text-text-light"/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-muted">{t.admin.plans.planName} (AR)</label>
                            <input type="text" value={plan.name.ar} onChange={e => handleMultilangChange(plan.id, Language.AR, 'name', e.target.value)} className="w-full p-2 bg-white/10 border border-glass-border rounded-lg text-text-light"/>
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-text-muted">{t.admin.plans.price}</label>
                            <input type="text" value={plan.price} onChange={e => handlePlanChange(plan.id, 'price', e.target.value)} className="w-full p-2 bg-white/10 border border-glass-border rounded-lg text-text-light"/>
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-text-muted">{t.admin.plans.features} (EN)</label>
                            <textarea rows={4} value={plan.features.en.join('\n')} onChange={e => handleMultilangChange(plan.id, Language.EN, 'features', e.target.value)} className="w-full p-2 bg-white/10 border border-glass-border rounded-lg text-text-light"/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-muted">{t.admin.plans.features} (AR)</label>
                            <textarea rows={4} value={plan.features.ar.join('\n')} onChange={e => handleMultilangChange(plan.id, Language.AR, 'features', e.target.value)} className="w-full p-2 bg-white/10 border border-glass-border rounded-lg text-text-light"/>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};


export const AdminDashboardSection: React.FC<AdminDashboardSectionProps> = () => {
  const { language, users, deleteUser, plans } = useAppContext();
  const t = translations[language];
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const planCounts = useMemo(() => {
    return users.reduce((acc, user) => {
      if (!user.isAdmin) {
          const planDetails = plans.find(p => p.id === user.plan);
          const planName = planDetails ? planDetails.name[language] : user.plan;
          acc[planName] = (acc[planName] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);
  }, [users, plans, language]);
  
  const filteredUsers = users.filter(u => !u.isAdmin && (
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  ));

  const handleEdit = (user: User) => {
    setUserToEdit(user);
    setIsModalOpen(true);
  };
  
  const handleAdd = () => {
      setUserToEdit(null);
      setIsModalOpen(true);
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <h1 className="text-3xl md:text-4xl font-bold text-text-light">{t.admin.title}</h1>
      
      <div>
          <h2 className="text-xl font-bold text-text-light mb-4">{t.admin.stats}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard title={t.admin.totalUsers} value={users.filter(u => !u.isAdmin).length} />
              {Object.entries(planCounts).map(([planName, count]) => (
                  <StatCard key={planName} title={`${planName}`} value={count} />
              ))}
          </div>
      </div>
      
      <BrandingManager t={t} />
      <SubscriptionLinkManager t={t} />
      <PlanManager t={t} />

      <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-glass-border">
          <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
            <h2 className="text-xl font-bold text-text-light">{t.admin.userManagement}</h2>
            <div className="w-full md:w-auto flex gap-2">
                <input type="text" placeholder={t.admin.searchUser} value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full md:w-64 p-2 bg-white/5 border border-glass-border rounded-lg text-text-light" />
                <button onClick={handleAdd} className="bg-gradient-to-r from-accent-start to-accent-end text-night-start font-semibold py-2 px-4 rounded-lg whitespace-nowrap">{t.admin.addUser}</button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
              <table className="w-full text-left">
                  <thead>
                      <tr className="border-b border-glass-border">
                          <th className="p-4 font-semibold text-text-light">{t.admin.table.name}</th>
                          <th className="p-4 font-semibold text-text-light">{t.admin.table.email}</th>
                          <th className="p-4 font-semibold text-text-light">{t.admin.table.plan}</th>
                          <th className="p-4 font-semibold text-right text-text-light">{t.admin.table.actions}</th>
                      </tr>
                  </thead>
                  <tbody>
                      {filteredUsers.map(user => {
                          const planDetails = plans.find(p => p.id === user.plan);
                          return (
                              <tr key={user.id} className="border-b border-glass-border hover:bg-white/5">
                                  <td className="p-4 text-text-light">{user.name}</td>
                                  <td className="p-4 text-text-muted">{user.email}</td>
                                  <td className="p-4"><span className="px-2 py-1 text-sm font-semibold bg-accent-end/10 text-accent-end rounded-full">{planDetails?.name[language] || user.plan}</span></td>
                                  <td className="p-4 text-right">
                                      <button onClick={() => handleEdit(user)} className="text-blue-400 hover:text-blue-300 p-2"><EditIcon className="w-5 h-5"/></button>
                                      <button onClick={() => setUserToDelete(user)} className="text-red-500 hover:text-red-400 p-2"><DeleteIcon className="w-5 h-5"/></button>
                                  </td>
                              </tr>
                          );
                      })}
                  </tbody>
              </table>
          </div>
      </div>
      
      {isModalOpen && <UserFormModal userToEdit={userToEdit} onClose={() => setIsModalOpen(false)} t={t} />}

      {userToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div className="bg-night-end rounded-2xl shadow-2xl p-8 w-full max-w-md m-4 border border-glass-border">
                <h2 className="text-2xl font-bold text-text-light mb-4">{t.admin.delete.confirmTitle}</h2>
                <p className="text-text-muted mb-6">{t.admin.delete.confirmMessage}</p>
                 <div className="flex justify-end gap-4">
                    <button onClick={() => setUserToDelete(null)} className="bg-white/10 text-text-light font-semibold py-2 px-6 rounded-lg">{t.admin.form.cancel}</button>
                    <button onClick={() => { deleteUser(userToDelete.id); setUserToDelete(null); }} className="bg-red-600 text-white font-semibold py-2 px-6 rounded-lg">{t.admin.delete.deleteButton}</button>
                </div>
            </div>
        </div>
      )}

    </div>
  );
};